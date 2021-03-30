import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Callback, Context } from "aws-lambda";
import AWS from "aws-sdk";
import formatResponse from "../format";

const S3 = new AWS.S3({});

export const ExtractGet: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  console.info("initializing egress-result");

  if (!process.env.S3_BUCKET || !event.pathParameters?.key) {
    return formatResponse("test unsuccessful")
  }

  const result = await S3.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: `egress/${event.pathParameters.key}`
  }).promise()

  // @ts-ignore
  const egress = JSON.parse(Buffer.from(result.Body).toString("utf8"))

  const ingressUrl = await S3.getSignedUrl("getObject", {
    Bucket: process.env.S3_BUCKET,
    Key: `ingress/${event.pathParameters.key}`
  })

  return formatResponse(JSON.stringify({
    result: egress,
    meta: {
      key: event.pathParameters.key,
      lastModified: result.LastModified,
      versionId: result.VersionId,
      replicationStatus: result.ReplicationStatus,
      ingressUrl
    }
  }))
}

export default ExtractGet;