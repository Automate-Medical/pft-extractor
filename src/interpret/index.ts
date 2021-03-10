import AWS from "aws-sdk";
import { S3Event, Context, S3Handler, Callback } from 'aws-lambda';
import interpret from './interpret'

const S3 = new AWS.S3({});

// @todo make use of callback?
export const handler: S3Handler = async (event: S3Event, context: Context, callback: Callback) => {
  console.info("Initializing lambda-function-interpret");

  if (!process.env.S3_BUCKET) {
    return callback("S3_BUCKET")
  }

  const Bucket = event.Records[0].s3.bucket.name
  const Key = event.Records[0].s3.object.key

  try {
    const response = await S3.getObject({ Bucket, Key }).promise()
    // @ts-ignore
    const json = JSON.parse(response.Body.toString())

    const interpretation = interpret(json)

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `interpretation/${Key.split("/")[1]}`,
      Body: JSON.stringify(interpretation),
      ContentType: 'application/json; charset=utf-8',
    };

    await S3.upload(params).promise()
  } catch(e) {
    console.log("FAILED")
  }

  console.info("Completing lambda-function-transform");
};