import { DynamoDB, S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { Extract, ExtractStage } from "../../../../@types/extract"

const DynamoDBClient = new DynamoDB.DocumentClient();
const S3Client = new S3();

export async function get(ID: string, TableName: string): Promise<Extract> {
  const itemParams = {
    Key: {
      ID
    },
    TableName
  };

  try {
    const record = await DynamoDBClient.get(itemParams).promise()

    const SignedURI = S3Client.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET as string,
      Key: `ingress/${ID}`
    })

    return {
      ID,
      ModifiedAt: record.Item?.ModifiedAt as string,
      Stage: record.Item?.Stage as ExtractStage,
      Result: record.Item?.Result,
      Source: {
        SignedURI,
        ARN: `s3://${process.env.S3_BUCKET}/ingress/${ID}`
      }
    }
  } catch {
    throw Error("getExtract process failure")
  }
}

interface INewExtract {
  jobTag?: string;
}

export async function create(params: INewExtract, TableName: string): Promise<{ ID: string }> {
  const ID = uuid();

  const Item: {
    ID: string;
    Stage: "NEW";
    ModifiedAt: string;
    JobTag?: string;
  } = {
    ID,
    Stage: "NEW",
    ModifiedAt: new Date().toISOString()
  }

  if (params.jobTag) Item.JobTag = params.jobTag

  const itemParams = { Item, TableName };

  await DynamoDBClient.put(itemParams).promise()

  return { ID }
}

interface IUpdateStage {
  ID: string;
  Stage: ExtractStage;
}

export async function updateStage(params: IUpdateStage, TableName: string): Promise<DynamoDB.PutItemOutput> {
  const dbInput = {
    AttributeUpdates: {
      Stage: {
        Action: "PUT",
        Value: params.Stage
      },
      ModifiedAt: {
        Action: "PUT",
        Value: new Date().toISOString()
      }
    },
    Key: {
      ID: params.ID
    },
    TableName
   };

  return await DynamoDBClient.update(dbInput).promise()
}

interface IUpdateResults {
  ID: string;
  Result: any;
}

export async function updateResults(params: IUpdateResults, TableName: string): Promise<DynamoDB.PutItemOutput> {
  const dbInput = {
    AttributeUpdates: {
      Stage: {
        Action: "PUT",
        Value: ExtractStage.IDENTIFIED
      },
      ModifiedAt: {
        Action: "PUT",
        Value: new Date().toISOString()
      },
      Result: {
        Action: "PUT",
        Value: params.Result
      }
    },
    Key: {
      ID: params.ID
    },
    TableName
   };

  return await DynamoDBClient.update(dbInput).promise()
}