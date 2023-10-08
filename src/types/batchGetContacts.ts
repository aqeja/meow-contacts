export interface OriginBatchGetContactsResponse {
  responses: Response[];
}
export interface TransformedBatchGetContactsResponse {
  connections: Response["person"][];
}
interface Response {
  httpStatusCode: number;
  person: Person;
  requestedResourceName: string;
  status: Status;
}

interface Status {}

interface Person {
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
  metadata: Metadata3;
  value: string;
  type: string;
  formattedType: string;
}

interface Metadata3 {
  primary?: boolean;
  source: Source;
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
  default: boolean;
}

interface Name {
  metadata: Metadata;
  displayName: string;
  familyName: string;
  givenName: string;
  displayNameLastFirst: string;
  unstructuredName: string;
}

interface Metadata {
  primary: boolean;
  source: Source;
}

interface Source {
  type: string;
  id: string;
}
