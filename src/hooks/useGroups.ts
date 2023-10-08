import { useQuery, useMutation } from "@tanstack/react-query";
import { listAllGroups, listGroups, createGroup, deleteGroup, updateGroup } from "@/api";
import { GroupBody, ListGroupsParams } from "@/types/group";

/**
 * @param all  - 是否列出全部group，不进行分页
 */
export function useListGroups(pageToken: string, all = false) {
  const pageSize = 30;
  const params = {
    pageSize,
    pageToken,
    groupFields: ["name", "memberCount", "groupType"],
  } as ListGroupsParams;
  return useQuery({
    queryKey: ["listGroups", pageSize, pageToken, all],
    queryFn: () => {
      return all ? listAllGroups(params) : listGroups(params).then((res) => res.data);
    },
  });
}

export function useCreateGroup() {
  const { refetch } = useListGroups("", true);
  return useMutation({
    onSuccess: () => {
      refetch();
    },
    mutationFn: ({ name }: { name: string }) => {
      return createGroup({
        contactGroup: {
          name,
        },
      });
    },
  });
}

export function useDeleteGroup() {
  const { refetch } = useListGroups("", true);
  return useMutation({
    onSuccess: () => {
      refetch();
    },
    mutationFn: ({ resource, deleteContacts }: { resource: string; deleteContacts: boolean }) => {
      return deleteGroup(resource, deleteContacts);
    },
  });
}

export function useEditGroup() {
  const { refetch } = useListGroups("", true);

  return useMutation({
    onSuccess: () => {
      refetch();
    },
    mutationFn: ({ resource, params }: { resource: string; params: GroupBody }) => {
      return updateGroup(resource, params);
    },
  });
}
