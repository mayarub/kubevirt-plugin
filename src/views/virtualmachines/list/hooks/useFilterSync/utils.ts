import type { KubevirtFilterState } from '@kubevirt-utils/hooks/useKubevirtDataViewFilters/types';
import {
  CLUSTER_LIST_FILTER_TYPE,
  PROJECT_LIST_FILTER_TYPE,
} from '@kubevirt-utils/utils/constants';
import { isEmpty } from '@kubevirt-utils/utils/utils';

export const hasMismatch = (targetValue: string | undefined, filterValues: string[]): boolean =>
  !!targetValue &&
  (isEmpty(filterValues) || filterValues.length > 1 || !filterValues.includes(targetValue));

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
