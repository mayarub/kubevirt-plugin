import {
  CLUSTER_LIST_FILTER_TYPE,
  PROJECT_LIST_FILTER_TYPE,
} from '@kubevirt-utils/utils/constants';
import { VirtualMachineRowFilterType } from '@virtualmachines/utils/constants';

type BuildTreeItemQueryOptions = {
  cluster?: string;
  clusters?: string[];
  folderName?: string;
  project?: string;
  query?: string;
};

export const buildTreeItemQuery = ({
  cluster,
  clusters,
  folderName,
  project,
  query,
}: BuildTreeItemQueryOptions): string => {
  const params = new URLSearchParams(query ?? '');

  params.delete(CLUSTER_LIST_FILTER_TYPE);
  params.delete(PROJECT_LIST_FILTER_TYPE);
  params.delete(VirtualMachineRowFilterType.Group);

  if (clusters?.length) {
    for (const clusterName of clusters) params.append(CLUSTER_LIST_FILTER_TYPE, clusterName);
  } else if (cluster) {
    params.set(CLUSTER_LIST_FILTER_TYPE, cluster);
  }
  if (project) {
    params.set(PROJECT_LIST_FILTER_TYPE, project);
  }
  if (folderName) {
    params.set(VirtualMachineRowFilterType.Group, folderName);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};
