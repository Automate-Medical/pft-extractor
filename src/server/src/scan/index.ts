import * as AWS from "aws-sdk";
import { SNSEvent, Context, SNSHandler, Callback } from 'aws-lambda';
import { updateStage as updateExtractStage } from "../api/models/Extract";
import { ExtractStage } from "../../../@types/extract";

const S3 = new AWS.S3();
const Textract = new AWS.Textract();

interface TexractMessage {
  JobId: string;
  Status: string;
  API: string;
  JobTag: string;
  Timestamp: number;
  DocumentLocation: {
    S3ObjectName: string;
    S3Bucket: string;
  }
}

// @todo make use of callback?
export const handler: SNSHandler = async (event: SNSEvent, context: Context, callback: Callback) => {
  const Message: TexractMessage = JSON.parse(event.Records[0].Sns.Message);
  const ID = Message.DocumentLocation.S3ObjectName.split("/")[1];

  if (Message.Status == "SUCCEEDED") {
    await updateExtractStage({ ID, Stage: ExtractStage.ANALYZED }, process.env.DYNAMODB_TABLE as string)

    const job = await Textract.getDocumentAnalysis({ JobId: Message.JobId }).promise()

    const params = {
      Bucket: process.env.S3_BUCKET as string,
      Key: `save-textract-output/${ID}`,
      Body: JSON.stringify(job),
      ContentType: 'application/json; charset=utf-8',
    };

    await S3.upload(params).promise();
  } else {
    await updateExtractStage({ ID, Stage: ExtractStage.ERROR }, process.env.DYNAMODB_TABLE as string)
  }

  callback(null, Message);
};