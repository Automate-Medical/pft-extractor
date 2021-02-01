import AWS from "aws-sdk";
import { S3Event, Context, S3Handler, Callback } from 'aws-lambda';
import transform from './transform'

const S3 = new AWS.S3({});
const Textract = new AWS.Textract({})

// @todo make use of callback?
export const handler: S3Handler = async (event: S3Event, context: Context, callback: Callback) => {
  console.info("Initializing lambda-function-transform");

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
      Key,
      Body: JSON.stringify(transformation),
      ContentType: 'application/json; charset=utf-8',
    };

    await S3.upload(params).promise()
  } catch(e) {
    console.log("FAILED")
  }
  
  console.info("Completing lambda-function-transform");
};