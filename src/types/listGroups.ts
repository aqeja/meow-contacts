export interface ListGroupsResponse {
  contactGroups: ContactGroup[];
  totalItems: number;
  nextSyncToken: string;
  nextPageToken?: string;
}

interface ContactGroup {
  resourceName: string;
  etag?: string;
  name: string;
  formattedName: string;
  groupType: "USER_CONTACT_GROUP" | "SYSTEM_CONTACT_GROUP";
  memberCount: number;
}
