import { S3 } from "aws-sdk";
import { S3Event, S3Handler } from 'aws-lambda';
import transform from './transform'
import { updateStage as updateExtractStage, updateResults as updateExtractResults } from "../api/models/Extract";
import { ExtractStage } from "../../../@types/extract";

const S3Client = new S3();

export const handler: S3Handler = async (event: S3Event) => {
  const Bucket = event.Records[0].s3.bucket.name
  const Key = event.Records[0].s3.object.key

  try {
    const response = await S3Client.getObject({ Bucket, Key }).promise()

    // @todo - should this do something else instead? probably
    if (!response.Body) return;

    const json = JSON.parse(response.Body.toString())

    const transformation = transform(json)

    const params = {
      Bucket,
      Key: `egress/${Key.split("/")[1]}`,
      Body: JSON.stringify(transformation),
      ContentType: 'application/json; charset=utf-8',
    };

    await S3Client.upload(params).promise()
    await updateExtractResults({ ID: Key.split("/")[1], Result: transformation }, process.env.DYNAMODB_TABLE as string)
  } catch(e) {
    await updateExtractStage({ ID: Key.split("/")[1], Stage: ExtractStage.ERROR }, process.env.DYNAMODB_TABLE as string)
  }
};