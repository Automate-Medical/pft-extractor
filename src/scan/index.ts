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
  if (!process.env.S3_BUCKET) {
    return callback("S3_BUCKET")
  }

  const Message: TexractMessage = JSON.parse(event.Records[0].Sns.Message);

  if (Message.Status == "SUCCEEDED") {
    const key = Message.DocumentLocation.S3ObjectName.split("/")[1]

    await updateExtractStage(key, "SCANNED")

    const job = await Textract.getDocumentAnalysis({ JobId: Message.JobId }).promise()

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `save-textract-output/${key}`,
      Body: JSON.stringify(job),
      ContentType: 'application/json; charset=utf-8',
    };

    await S3.upload(params).promise();
  } else {
    const key = Message.DocumentLocation.S3ObjectName.split("/")[1]

    await updateExtractStage(key, "ERROR")
  }
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