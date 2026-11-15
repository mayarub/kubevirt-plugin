import { CLUSTER_LIST_FILTER_TYPE } from '@kubevirt-utils/utils/constants';
import { universalComparator } from '@kubevirt-utils/utils/utils';
import { type TreeViewDataItem } from '@patternfly/react-core';

import { CLUSTER_SET_SELECTOR_PREFIX } from './constants';

type TreeViewDataItemWithHref = { href?: string } & TreeViewDataItem;

const sortClusterNames = (clusterNames: string[]): string[] =>
  [...clusterNames].sort((a, b) => universalComparator(a, b));

const getClusterNamesFromSetItem = (item: TreeViewDataItem): string[] =>
  (item.children ?? []).map((child) => child.name as string).filter(Boolean);

export const clusterNamesMatchSorted = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }
  const sortedLeft = sortClusterNames(left);
  const sortedRight = sortClusterNames(right);
  return sortedLeft.every((cluster, index) => cluster === sortedRight[index]);
};

export const getClusterFilterValuesFromQuery = (query: string | undefined): string[] => {
  const params = new URLSearchParams(query ?? '');
  return params.getAll(CLUSTER_LIST_FILTER_TYPE).filter(Boolean);
};

export const getClusterSetTreeItemMatchingClusterFilters = (
  dataMap: Record<string, TreeViewDataItemWithHref> | undefined,
  clusterFilterValues: string[],
): TreeViewDataItemWithHref | undefined => {
  if (!dataMap || clusterFilterValues.length === 0) {
    return undefined;
  }

  return Object.values(dataMap).find((item) => {
    if (!item.id?.startsWith(CLUSTER_SET_SELECTOR_PREFIX)) {
      return false;
    }
    return clusterNamesMatchSorted(getClusterNamesFromSetItem(item), clusterFilterValues);
  });
};

export const isClusterSetSelectedInQuery = (
  clustersInSet: string[],
  queryParams: string | undefined,
): boolean => {
  const clusterFilters = getClusterFilterValuesFromQuery(queryParams);
  return clusterNamesMatchSorted(clustersInSet, clusterFilters);
};
