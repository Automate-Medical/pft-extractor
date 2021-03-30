import AWS from "aws-sdk";
import { S3Event, Context, S3Handler, Callback } from 'aws-lambda';

const Textract = new AWS.Textract({})

// @todo make use of callback?
export const handler: S3Handler = async (event: S3Event, context: Context, callback: Callback) => {
  if (!process.env.SNS_TOPIC_ARN || !process.env.ROLE_ARN) {
    return callback("SNS_TOPIC_ARN or ROLE_ARN not set")
  }

  const key = event.Records[0].s3.object.key.split("/")[1];

  await updateExtractStage(key, "STARTED")

  const input = {
    "DocumentLocation": {
      "S3Object": {
        "Bucket": event.Records[0].s3.bucket.name,
        "Name": encodeURI(event.Records[0].s3.object.key)
      }
    },
    "NotificationChannel": {
      "SNSTopicArn": process.env.SNS_TOPIC_ARN,
      "RoleArn": process.env.ROLE_ARN
    },
    "JobTag": "pft-extractor-ingress",
    "FeatureTypes": ["TABLES"]
  }

  await Textract.startDocumentAnalysis(input).promise()
};

async function updateExtractStage(key: string, stage: string) {
  const DynamoDB = new AWS.DynamoDB();

  var dbInput = {
    AttributeUpdates: {
      Stage: {
        Action: "PUT",
        Value: {
          S: stage
        }
      },
      ModifiedAt: {
        Action: "PUT",
        Value: {
          S: new Date().toISOString()
        }
      }
    },
    Key: {
      UUID: {
        S: key
      }
    },
    TableName: "Extracts"
   };


  return await DynamoDB.updateItem(dbInput).promise()
}