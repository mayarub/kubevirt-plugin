import { CLUSTER_LIST_FILTER_TYPE } from '@kubevirt-utils/utils/constants';

import {
  clusterNamesMatchSorted,
  getClusterSetTreeItemMatchingClusterFilters,
  isClusterSetSelectedInQuery,
} from './clusterSetTreeSelection';
import { CLUSTER_SET_SELECTOR_PREFIX } from './constants';
import { type TreeViewDataItemWithHref } from './utils';

describe('clusterSetTreeSelection', () => {
  it('clusterNamesMatchSorted compares cluster lists regardless of order', () => {
    expect(clusterNamesMatchSorted(['b', 'a'], ['a', 'b'])).toBe(true);
    expect(clusterNamesMatchSorted(['a'], ['a', 'b'])).toBe(false);
  });

  it('isClusterSetSelectedInQuery matches fleet cluster query params', () => {
    const query = `?${CLUSTER_LIST_FILTER_TYPE}=cluster-b&${CLUSTER_LIST_FILTER_TYPE}=cluster-a`;
    expect(isClusterSetSelectedInQuery(['cluster-a', 'cluster-b'], query)).toBe(true);
    expect(isClusterSetSelectedInQuery(['cluster-a'], query)).toBe(false);
  });

  it('getClusterSetTreeItemMatchingClusterFilters finds the set node', () => {
    const setItem: TreeViewDataItemWithHref = {
      children: [{ name: 'cluster-a' }, { name: 'cluster-b' }],
      id: `${CLUSTER_SET_SELECTOR_PREFIX}/production`,
      name: 'production',
    };
    const dataMap = { [setItem.id]: setItem };

    expect(getClusterSetTreeItemMatchingClusterFilters(dataMap, ['cluster-b', 'cluster-a'])).toBe(
      setItem,
    );
    expect(getClusterSetTreeItemMatchingClusterFilters(dataMap, ['cluster-a'])).toBeUndefined();
  });
});
