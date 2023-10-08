import client from "@/common/request";
import { Contact, ContactResponse, PersonField } from "@/types/contact";
import { ListContactsParams, ListContactsResponse } from "@/types/listContacts";
import { SearchContactsResponse } from "@/types/searchContacts";
import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * 读取联系人列表
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list
 */
export const listContacts = ({ personFields, pageSize, pageToken, sortOrder }: ListContactsParams) => {
  const query = new URLSearchParams({
    personFields: personFields.join(),
    pageSize: pageSize.toString(),
    pageToken,
    sortOrder: sortOrder.toString(),
  });
  return client.get<ListContactsResponse>(`/v1/people/me/connections?${query}`);
};

export const listAllContacts = (params: ListContactsParams) => {
  let result: ListContactsResponse | null = null;
  const recursiveRequest: (response: AxiosResponse<ListContactsResponse>) => Promise<ListContactsResponse> = (
    response: AxiosResponse<ListContactsResponse>,
  ) => {
    if (!result) {
      result = response.data;
    } else {
      result = {
        ...response.data,
        connections: [...result.connections, ...response.data.connections],
      };
    }
    const nextPageToken = response.data.nextPageToken;
    if (!!response.data.nextPageToken) {
      return listContacts({
        ...params,
        pageToken: nextPageToken,
      }).then(recursiveRequest);
    } else {
      return Promise.resolve(result);
    }
  };
  return listContacts(params).then(recursiveRequest);
};

/**
 * 搜索联系人前的热身请求
 * @see https://developers.google.com/people/v1/contacts#search_the_users_contacts
 */
const searchContactWarmup = (config?: AxiosRequestConfig) => {
  return client.get("/v1/people:searchContacts?query=&readMask=names,photos", config);
};

/**
 * 搜索联系人
 * @param query 搜索关键字
 * @see https://developers.google.com/people/api/rest/v1/people/searchContacts
 */
export const searchContacts = async (
  { query, readMask, pageSize }: { query: string; pageSize: number; readMask: PersonField[] },
  config?: AxiosRequestConfig,
) => {
  await searchContactWarmup(config);
  return client.get<SearchContactsResponse>(
    `/v1/people:searchContacts?query=${query}&readMask=${readMask.join()}&pageSize=${pageSize}`,
    {
      ...config,
    },
  );
};

/**
 * 创建联系人
 * @see https://developers.google.com/people/api/rest/v1/people/createContact
 */
export const createContact = (contact: Contact, fields: PersonField[]) => {
  return client.post(`/v1/people:createContact?personFields=${fields.join()}`, contact);
};

/**
 * 编辑联系人
 * @see https://developers.google.com/people/api/rest/v1/people/updateContact
 */
export const updateContact = ({
  resource,
  body,
  updatePersonFields,
  personFields,
}: {
  resource: string;
  body: Partial<Contact>;
  updatePersonFields: PersonField[];
  /**
   * 返回的字段
   */
  personFields: PersonField[];
}) => {
  return client.post(
    `/v1/${resource}:updateContact?updatePersonFields=${updatePersonFields.join()}&personFields=${personFields.join()}`,
    body,
  );
};

/**
 * 删除联系人
 * @see https://developers.google.com/people/api/rest/v1/people/deleteContact
 */

export const deleteContact = (resource: string) => {
  return client.delete(`/v1/${resource}:deleteContact`);
};

export const getContact = (resource: string, fields: PersonField[]) => {
  return client.get<ContactResponse>(`/v1/${resource}?personFields=${fields.join()}`);
};
