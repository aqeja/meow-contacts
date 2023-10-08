import client from "@/common/request";
import { GroupBody, ListGroupsParams } from "@/types/group";
import { ListGroupContactsResponse } from "@/types/listGroupContacts";
import { ListGroupsResponse } from "@/types/listGroups";
import { AxiosResponse } from "axios";

/**
 * 列出所有group
 * @see https://developers.google.com/people/api/rest/v1/contactGroups/list
 */

export const listGroups = (params: ListGroupsParams) => {
  const query = new URLSearchParams({
    ...params,
    ...(!!params.groupFields ? { groupFields: params.groupFields.join() } : {}),
  } as any);
  return client.get<ListGroupsResponse>(`/v1/contactGroups?${query}`);
};

export const listAllGroups = (params: ListGroupsParams) => {
  let result: ListGroupsResponse | null = null;
  const recursiveRequest: (response: AxiosResponse<ListGroupsResponse>) => Promise<ListGroupsResponse> = (
    response: AxiosResponse<ListGroupsResponse>,
  ) => {
    if (!result) {
      result = response.data;
    } else {
      result = {
        ...response.data,
        contactGroups: [...result.contactGroups, ...response.data.contactGroups],
      };
    }
    const nextPageToken = response.data.nextPageToken;
    if (!!response.data.nextPageToken) {
      return listGroups({
        ...params,
        pageToken: nextPageToken,
      }).then(recursiveRequest);
    } else {
      return Promise.resolve(result);
    }
  };
  return listGroups(params).then(recursiveRequest);
};

/**
 * 创建group
 * @see https://developers.google.com/people/api/rest/v1/contactGroups/create
 */
export const createGroup = (body: GroupBody) => {
  return client.post("/v1/contactGroups", body);
};

/**
 * 更新group
 * @see https://developers.google.com/people/api/rest/v1/contactGroups/update
 */
export const updateGroup = (resource: string, body: GroupBody) => {
  return client.put(`/v1/${resource}`, body);
};
/**
 * 删除group
 * @param deleteContact 是否删除此分组里的联系人
 * @see https://developers.google.com/people/api/rest/v1/contactGroups/delete
 */
export const deleteGroup = (resource: string, deleteContacts: boolean) => {
  return client.delete(`/v1/${resource}?deleteContacts=${deleteContacts}`);
};

/**
 * 将联系人 关联/取消关联 到某个分组
 * @see https://developers.google.com/people/api/rest/v1/contactGroups.members/modify
 */
export const bindContacts = (
  groupResourceName: string,
  { resourceNamesToAdd, resourceNamesToRemove }: { resourceNamesToAdd?: string[]; resourceNamesToRemove?: string[] },
) => {
  return client.post(`/v1/${groupResourceName}/members:modify`, {
    resourceNamesToAdd,
    resourceNamesToRemove,
  });
};
/**
 * 获取分组下的联系人
 * @see https://developers.google.com/people/api/rest/v1/contactGroups/get
 */
export const listGroupContacts = (groupResourceName: string) => {
  const fields = ["name", "metadata", "groupType", "clientData"].join();
  return client.get<ListGroupContactsResponse>(`/v1/${groupResourceName}?maxMembers=${999}&groupFields=${fields}`);
};
