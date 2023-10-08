export type PersonField =
  | "addresses"
  | "ageRanges"
  | "biographies"
  | "birthdays"
  | "calendarUrls"
  | "clientData"
  | "coverPhotos"
  | "emailAddresses"
  | "events"
  | "externalIds"
  | "genders"
  | "imClients"
  | "interests"
  | "locales"
  | "locations"
  | "memberships"
  | "metadata"
  | "miscKeywords"
  | "names"
  | "nicknames"
  | "occupations"
  | "organizations"
  | "phoneNumbers"
  | "photos"
  | "relations"
  | "sipAddresses"
  | "skills"
  | "urls"
  | "userDefined";

export interface Contact {
  names: Name[];
  emailAddresses: EmailAddress[];
  phoneNumbers: EmailAddress[];
  addresses: Address[];
  birthdays: Birthday[];
  organizations: Organization[];
  relations: Relation[];
  urls: Url[];
  events: Event[];
  nicknames: EmailAddress[];
  occupations: EmailAddress[];
  imClients: ImClient[];
  userDefined: UserDefined[];
  locales: EmailAddress[];
  interests: EmailAddress[];
  coverPhotos: CoverPhoto[];
  photos: CoverPhoto[];
  genders: EmailAddress[];
  ageRanges: EmailAddress[];
  miscKeywords: EmailAddress[];
  metadata: Metadatum[];
  sipAddresses: EmailAddress[];
  clientData: UserDefined[];
  calendarUrls: EmailAddress[];
  memberships: Membership[];
  skills: EmailAddress[];
}

interface Membership {
  contactGroupMembership: ContactGroupMembership;
}

interface ContactGroupMembership {
  contactGroupResourceName: string;
}

interface Metadatum {
  source: Source;
}

interface Source {
  type: string;
  id: string;
}

interface CoverPhoto {
  url: string;
}

interface UserDefined {
  key: string;
  value: string;
}

interface ImClient {
  protocol: string;
  username: string;
}

interface Event {
  date: Date;
  type: string;
}

interface Url {
  value: string;
  type: string;
}

interface Relation {
  person: string;
  type: string;
}

interface Organization {
  name: string;
  title: string;
  type: string;
}

interface Birthday {
  date: Date;
}

interface Date {
  year: number;
  month: number;
  day: number;
}

interface Address {
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

interface EmailAddress {
  value: string;
}

interface Name {
  givenName: string;
  familyName: string;
}

export interface ContactResponse {
  resourceName: string;
  etag: string;
  metadata: Metadata;
  names: Name[];
  photos: Photo[];
  birthdays: Birthday[];
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumber[];
  organizations: Organization[];
  memberships: Membership[];
}

interface Membership {
  metadata: Metadata4;
  contactGroupMembership: ContactGroupMembership;
}

interface ContactGroupMembership {
  contactGroupId: string;
  contactGroupResourceName: string;
}

interface Metadata4 {
  source: Source2;
}

interface Organization {
  metadata: Metadata2;
  name: string;
  department: string;
  title: string;
}

interface PhoneNumber {
  metadata: Metadata2;
  value: string;
  canonicalForm: string;
  type: string;
  formattedType: string;
}

interface EmailAddress {
  metadata: Metadata3;
  value: string;
  type: string;
  formattedType: string;
}

interface Metadata3 {
  primary?: boolean;
  source: Source2;
}

interface Birthday {
  metadata: Metadata2;
  date: Date;
  text: string;
}

interface Date {
  year: number;
  month: number;
  day: number;
}

interface Photo {
  metadata: Metadata2;
  url: string;
  default: boolean;
}

interface Name {
  metadata: Metadata2;
  displayName: string;
  familyName: string;
  givenName: string;
  displayNameLastFirst: string;
  unstructuredName: string;
}

interface Metadata2 {
  primary: boolean;
  source: Source2;
}

interface Source2 {
  type: string;
  id: string;
}

interface Metadata {
  sources: Source[];
  objectType: string;
}

interface Source {
  type: string;
  id: string;
  etag: string;
  updateTime: string;
}
