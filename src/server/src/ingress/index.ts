import { Textract } from "aws-sdk";
import { S3Event, Context, S3Handler, Callback } from 'aws-lambda';
import { updateStage as updateExtractStage } from "../api/models/Extract";
import { ExtractStage } from "../../../@types/extract";

const TextractClient = new Textract();

// @todo make use of callback?
export const handler: S3Handler = async (event: S3Event, context: Context, callback: Callback) => {
  const ID = event.Records[0].s3.object.key.split("/")[1];

  await updateExtractStage({ ID, Stage: ExtractStage.STARTED }, process.env.DYNAMODB_TABLE as string)

  const input = {
    "DocumentLocation": {
      "S3Object": {
        "Bucket": event.Records[0].s3.bucket.name,
        "Name": encodeURI(event.Records[0].s3.object.key)
      }
    },
    "NotificationChannel": {
      "SNSTopicArn": process.env.SNS_TOPIC_ARN as string,
      "RoleArn": process.env.ROLE_ARN as string
    },
    "JobTag": ID,
    "FeatureTypes": ["TABLES"]
  }

  try {
    const response = await TextractClient.startDocumentAnalysis(input).promise()
    callback(null, response)
  } catch (e) {
    callback(e)
  }
};