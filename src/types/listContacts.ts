import { PersonField } from "./contact";

export interface ListContactsResponse {
  connections: Connection[];
  nextPageToken: string;
  totalPeople: number;
  totalItems: number;
}
export interface ListContactsParams {
  personFields: PersonField[];
  pageToken: string;
  pageSize: number;
  sortOrder: number;
}
interface Connection {
  resourceName: string;
  etag: string;
  names: Name[];
  photos: Photo[];
  phoneNumbers: PhoneNumber[];
  memberships: Membership[];
  emailAddresses?: EmailAddress[];
  organizations?: Organization[];
}

interface Organization {
  metadata: Metadata;
  name: string;
  department: string;
  title: string;
}

interface EmailAddress {
  metadata: Metadata;
  value: string;
  type: string;
  formattedType: string;
}

interface Membership {
  metadata: Metadata2;
  contactGroupMembership: ContactGroupMembership;
}

interface ContactGroupMembership {
  contactGroupId: string;
  contactGroupResourceName: string;
}

interface Metadata2 {
  source: Source;
}

interface PhoneNumber {
  metadata: Metadata;
  value: string;
  canonicalForm: string;
  type: string;
  formattedType: string;
}

interface Photo {
  metadata: Metadata;
  url: string;
  default?: boolean;
}

interface Name {
  metadata: Metadata;
  displayName: string;
  givenName: string;
  displayNameLastFirst: string;
  unstructuredName: string;
  familyName?: string;
  middleName?: string;
}

interface Metadata {
  primary: boolean;
  source: Source;
}

interface Source {
  type: string;
  id: string;
}
