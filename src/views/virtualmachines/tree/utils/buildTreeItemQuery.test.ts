import { CLUSTER_LIST_FILTER_TYPE } from '@kubevirt-utils/utils/constants';

import { buildTreeItemQuery } from './treeItemQuery';

describe('buildTreeItemQuery', () => {
  it('appends multiple cluster filters for a cluster set', () => {
    const query = buildTreeItemQuery({ clusters: ['cluster-b', 'cluster-a'] });
    expect(query).toBe('?cluster=cluster-b&cluster=cluster-a');
  });

  it('replaces existing cluster filters when clusters are provided', () => {
    const query = buildTreeItemQuery({
      clusters: ['cluster-a'],
      query: `${CLUSTER_LIST_FILTER_TYPE}=old-cluster`,
    });
    const params = new URLSearchParams(query.slice(1));
    expect(params.getAll(CLUSTER_LIST_FILTER_TYPE)).toEqual(['cluster-a']);
  });
});
