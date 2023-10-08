export type GroupBody = {
  contactGroup: {
    name: string;
    etag?: string;
  };
  readGroupFields?: ("clientData" | "groupType" | "metadata" | "name")[];
};

export type ListGroupsParams = {
  pageToken?: string;
  /**
   * @default 30
   */
  pageSize?: number;
  syncToken?: string;
  groupFields?: ("clientData" | "groupType" | "metadata" | "name" | "memberCount")[];
};
