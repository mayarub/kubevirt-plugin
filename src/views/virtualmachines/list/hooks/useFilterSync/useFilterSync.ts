import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import type { OnSetFilters } from '@kubevirt-utils/hooks/useKubevirtDataViewFilters/types';
import useNamespaceParam from '@kubevirt-utils/hooks/useNamespaceParam';
import {
  CLUSTER_LIST_FILTER_TYPE,
  PROJECT_LIST_FILTER_TYPE,
} from '@kubevirt-utils/utils/constants';
import useClusterParam from '@multicluster/hooks/useClusterParam';
import useIsACMPage from '@multicluster/useIsACMPage';

import {
  getFleetPathToolbarFilters,
  getFleetQueryFilterSyncSignature,
  navigateToWidenedVmListPath,
  widenUrlPathForToolbarFilters,
} from './utils';

/**
 * Unified hook that handles bidirectional sync between the URL path
 * (namespace/cluster) and the toolbar's project/cluster filter state.
 *
 * Three directions:
 *  1. Tree view click changes the path → sync toolbar filter state to match.
 *  2. Tree view click changes only query (fleet path, e.g. cluster set / All clusters) → sync toolbar from URL.
 *  3. Toolbar filter change creates a mismatch → broaden the URL path (e.g. query params have multiple projects, but the URL path is /ns/project1 → broaden the URL path to /all-namespaces).
 *
 * A `pathChangedAutomaticallyRef` ref prevents the broadening navigation
 * from triggering an unwanted filter-state reset on the next render.
 */
const useFilterSync = (onSetFilters: OnSetFilters): void => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const namespace = useNamespaceParam();
  const cluster = useClusterParam();
  const isACMPage = useIsACMPage();

  const prevRef = useRef({ cluster, namespace });
  const pathChangedAutomaticallyRef = useRef(false);
  const lastFleetQueryFilterSyncRef = useRef('');

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = { cluster, namespace };

    const pathChanged = prev.namespace !== namespace || prev.cluster !== cluster;
    const projectFilterValues = searchParams.getAll(PROJECT_LIST_FILTER_TYPE).filter(Boolean);
    const clusterFilterValues = searchParams.getAll(CLUSTER_LIST_FILTER_TYPE).filter(Boolean);

    if (pathChanged && pathChangedAutomaticallyRef.current) {
      pathChangedAutomaticallyRef.current = false;
      return;
    }

    if (pathChanged) {
      lastFleetQueryFilterSyncRef.current = '';
      onSetFilters({
        [CLUSTER_LIST_FILTER_TYPE]: cluster ? [cluster] : clusterFilterValues,
        [PROJECT_LIST_FILTER_TYPE]: namespace ? [namespace] : projectFilterValues,
      });
      return;
    }

    const { scope, shouldNavigate } = widenUrlPathForToolbarFilters(
      { cluster, namespace },
      clusterFilterValues,
      projectFilterValues,
    );

    if (shouldNavigate) {
      pathChangedAutomaticallyRef.current = true;
      navigateToWidenedVmListPath({ isACMPage, navigate, scope, searchParams });
      return;
    }

    if (!cluster) {
      const signature = getFleetQueryFilterSyncSignature(
        clusterFilterValues,
        projectFilterValues,
        namespace,
      );

      if (signature !== lastFleetQueryFilterSyncRef.current) {
        lastFleetQueryFilterSyncRef.current = signature;
        onSetFilters(
          getFleetPathToolbarFilters(clusterFilterValues, projectFilterValues, namespace),
        );
      }
    }
  }, [searchParams, namespace, cluster, isACMPage, navigate, onSetFilters]);
};

export default useFilterSync;
