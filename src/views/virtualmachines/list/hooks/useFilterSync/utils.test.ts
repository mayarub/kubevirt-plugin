import {
  CLUSTER_LIST_FILTER_TYPE,
  PROJECT_LIST_FILTER_TYPE,
} from '@kubevirt-utils/utils/constants';

import {
  getFleetPathToolbarFilters,
  getFleetQueryFilterSyncSignature,
  widenUrlPathForToolbarFilters,
} from './utils';

/** Mirrors path vs query filter resolution in `useFilterSync` on path change. */
const pathOrQueryFilterValues = (
  pathValue: string | undefined | null,
  queryValues: string[],
): string[] => (pathValue ? [pathValue] : queryValues);

describe('useFilterSync utils', () => {
  it('pathOrQueryFilterValues prefers the path segment over query params', () => {
    expect(pathOrQueryFilterValues('cluster-a', ['cluster-b'])).toEqual(['cluster-a']);
    expect(pathOrQueryFilterValues(undefined, ['cluster-a', 'cluster-b'])).toEqual([
      'cluster-a',
      'cluster-b',
    ]);
  });

  it('broadenPathScopeForFilters clears path when cluster filters disagree', () => {
    expect(
      widenUrlPathForToolbarFilters(
        { cluster: 'cluster-a', namespace: 'app' },
        ['cluster-a', 'cluster-b'],
        [],
      ),
    ).toEqual({
      scope: { cluster: undefined, namespace: undefined },
      shouldNavigate: true,
    });
  });

  it('broadenPathScopeForFilters keeps cluster when only project filters disagree', () => {
    expect(
      widenUrlPathForToolbarFilters(
        { cluster: 'cluster-a', namespace: 'app' },
        ['cluster-a'],
        ['other', 'app'],
      ),
    ).toEqual({
      scope: { cluster: 'cluster-a', namespace: undefined },
      shouldNavigate: true,
    });
  });

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
