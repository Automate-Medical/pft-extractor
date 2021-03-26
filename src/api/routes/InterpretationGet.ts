import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Callback, Context } from "aws-lambda";
import AWS from "aws-sdk";
import formatResponse from "../format";

const S3 = new AWS.S3({});

export const InterpretationGet: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  console.info("initializing interpretation");

  if (!process.env.S3_BUCKET || !event.pathParameters?.key) {
    return formatResponse("test unsuccessful")
  }

  const result = await S3.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: `interpretation/${event.pathParameters.key}`
  }).promise()

  // @ts-ignore
  const interpretation = JSON.parse(Buffer.from(result.Body).toString("utf8"))

  return formatResponse(JSON.stringify({
    interpretation
  }))
}

export default InterpretationGet;