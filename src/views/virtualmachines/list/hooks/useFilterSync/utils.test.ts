import {
  CLUSTER_LIST_FILTER_TYPE,
  PROJECT_LIST_FILTER_TYPE,
} from '@kubevirt-utils/utils/constants';

import { getFleetPathToolbarFilters, getFleetQueryFilterSyncSignature } from './utils';

describe('useFilterSync utils', () => {
  it('getFleetQueryFilterSyncSignature is order-sensitive on cluster list', () => {
    expect(getFleetQueryFilterSyncSignature(['b', 'a'], [], undefined)).toBe('b\0a|');
    expect(getFleetQueryFilterSyncSignature(['a', 'b'], [], undefined)).toBe('a\0b|');
  });

  it('getFleetPathToolbarFilters maps multi-cluster query to toolbar state', () => {
    expect(getFleetPathToolbarFilters(['cluster-a', 'cluster-b'], [], undefined)).toEqual({
      [CLUSTER_LIST_FILTER_TYPE]: ['cluster-a', 'cluster-b'],
      [PROJECT_LIST_FILTER_TYPE]: [],
    });
  });
});
