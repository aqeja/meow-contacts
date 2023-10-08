export interface ListGroupContactsResponse {
  resourceName: string;
  etag: string;
  metadata: Metadata;
  groupType: string;
  name: string;
  formattedName: string;
  memberResourceNames?: string[];
}

interface Metadata {
  updateTime: string;
}
