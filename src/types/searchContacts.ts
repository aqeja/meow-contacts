export interface SearchContactsResponse {
  results: Result[];
}

interface Result {
  person: Person;
}

interface Person {
  resourceName: string;
  etag: string;
  names: Name[];
  photos: Photo[];
}

interface Photo {
  metadata: Metadata;
  url: string;
}

interface Name {
  metadata: Metadata;
  displayName: string;
  familyName: string;
  givenName: string;
  middleName: string;
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
