export interface GoogleError {
  error: Error;
}

interface Error {
  code: number;
  message: string;
  status: string;
  details: Detail[];
}

interface Detail {
  "@type": string;
  fieldViolations: FieldViolation[];
}

interface FieldViolation {
  description: string;
}
