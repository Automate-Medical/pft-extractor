import { PFT } from ".";

export interface Extract {
  ID: string;
  ModifiedAt: string;
  Stage: ExtractStage;
  Result?: PFT;
  DocumentAnalysis?: string; // ARN to S3 object?
  Source?: {
    SignedURI: string;
    ARN: string;
  }; // ARN to S3 object?
}

export enum ExtractStage {
  NEW = "NEW",
  STARTED = "STARTED",
  ANALYZED = "ANALYZED",
  IDENTIFIED = "IDENTIFIED",
  ERROR = "ERROR"
}