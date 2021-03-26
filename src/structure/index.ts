import AWS from "aws-sdk";
import { S3Event, Context, S3Handler, Callback } from 'aws-lambda';
import transform from './transform'

const S3 = new AWS.S3({});

// @todo make use of callback?
export const handler: S3Handler = async (event: S3Event, context: Context, callback: Callback) => {
  if (!process.env.S3_BUCKET) {
    return callback("S3_BUCKET")
  }

  const Bucket = event.Records[0].s3.bucket.name
  const Key = event.Records[0].s3.object.key

  try {
    const response = await S3.getObject({ Bucket, Key }).promise()
    // @ts-ignore
    const json = JSON.parse(response.Body.toString())

    const transformation = transform(json)

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `egress/${Key.split("/")[1]}`,
      Body: JSON.stringify(transformation),
      ContentType: 'application/json; charset=utf-8',
    };

    await S3.upload(params).promise()
    await updateExtractStage(Key.split("/")[1], "FINISHED")
  } catch(e) {
    await updateExtractStage(Key.split("/")[1], "ERROR")
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