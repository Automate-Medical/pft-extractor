import * as AWS from "aws-sdk";
import { S3Event, Context, S3Handler, Callback } from 'aws-lambda';
import interpret from './interpret'

const S3 = new AWS.S3();

// @todo make use of callback?
export const handler: S3Handler = async (event: S3Event, context: Context, callback: Callback) => {
  const Bucket = event.Records[0].s3.bucket.name
  const Key = event.Records[0].s3.object.key

  try {
    const response = await S3.getObject({ Bucket, Key }).promise()

    // @todo - should this do something else instead? probably
    if (!response.Body) return;

    const json = JSON.parse(response.Body.toString())

    const interpretation = interpret(json)

    const params = {
      Bucket,
      Key: `interpretation/${Key.split("/")[1]}`,
      Body: JSON.stringify(interpretation),
      ContentType: 'application/json; charset=utf-8',
    };

    await S3.upload(params).promise()

    return callback(null, interpretation);
  } catch(e) {
    console.log(e)
    return callback(`Interpretation failed for ${Key}`)
  }
};