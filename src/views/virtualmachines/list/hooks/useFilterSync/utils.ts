import type { KubevirtFilterState } from '@kubevirt-utils/hooks/useKubevirtDataViewFilters/types';
import {
  CLUSTER_LIST_FILTER_TYPE,
  PROJECT_LIST_FILTER_TYPE,
} from '@kubevirt-utils/utils/constants';
import { isEmpty } from '@kubevirt-utils/utils/utils';
import { getACMVMListURL, getVMListURL } from '@multicluster/urls';

import {
  type NavigateToWidenedVmListPathParams,
  type PathScope,
  type WidenUrlPathForToolbarFiltersResult,
} from './types/types';

export const hasMismatch = (targetValue: string | undefined, filterValues: string[]): boolean =>
  !!targetValue &&
  (isEmpty(filterValues) || filterValues.length > 1 || !filterValues.includes(targetValue));

export const widenUrlPathForToolbarFilters = (
  pathScope: PathScope,
  clusterFilterValues: string[],
  projectFilterValues: string[],
): WidenUrlPathForToolbarFiltersResult => {
  const cluster = pathScope.cluster ?? undefined;

  if (hasMismatch(cluster, clusterFilterValues)) {
    return {
      scope: { cluster: undefined, namespace: undefined },
      shouldNavigate: true,
    };
  }

  if (hasMismatch(pathScope.namespace, projectFilterValues)) {
    return {
      scope: { cluster, namespace: undefined },
      shouldNavigate: true,
    };
  }

  return {
    scope: { cluster, namespace: pathScope.namespace },
    shouldNavigate: false,
  };
};

/** Stable key for fleet-level URLs where cluster/project live only in query params (e.g. cluster set). */
export const getFleetQueryFilterSyncSignature = (
  clusterFilterValues: string[],
  projectFilterValues: string[],
  namespace: string | undefined,
): string => {
  const projectFilters = namespace ? [namespace] : projectFilterValues;
  return `${clusterFilterValues.join('\0')}|${projectFilters.join('\0')}`;
};

export const getFleetPathToolbarFilters = (
  clusterFilterValues: string[],
  projectFilterValues: string[],
  namespace: string | undefined,
): Pick<
  KubevirtFilterState,
  typeof CLUSTER_LIST_FILTER_TYPE | typeof PROJECT_LIST_FILTER_TYPE
> => ({
  [CLUSTER_LIST_FILTER_TYPE]: clusterFilterValues,
  [PROJECT_LIST_FILTER_TYPE]: namespace ? [namespace] : projectFilterValues,
});

export const navigateToWidenedVmListPath = ({
  isACMPage,
  navigate,
  scope,
  searchParams,
}: NavigateToWidenedVmListPathParams): void => {
  const pathname = isACMPage
    ? getACMVMListURL(scope.cluster, scope.namespace)
    : getVMListURL(undefined, scope.namespace);

  navigate({ pathname, search: searchParams.toString() }, { replace: true });
};
