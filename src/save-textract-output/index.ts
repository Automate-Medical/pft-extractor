import AWS from "aws-sdk";
import { SNSEvent, Context, SNSHandler, Callback } from 'aws-lambda';

const S3 = new AWS.S3({});
const Textract = new AWS.Textract({})

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
  console.info("initializing save-textract-output");

  if (!process.env.S3_BUCKET) {
    return callback("S3_BUCKET")
  }

  const Message: TexractMessage = JSON.parse(event.Records[0].Sns.Message);

  if (Message.Status == "SUCCEEDED") {
    const job = await Textract.getDocumentAnalysis({ JobId: Message.JobId }).promise()

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${Message.DocumentLocation.S3ObjectName}`,
      Body: JSON.stringify(job),
      ContentType: 'application/json; charset=utf-8',
    };

    const response = await S3.upload(params).promise();
  }
};