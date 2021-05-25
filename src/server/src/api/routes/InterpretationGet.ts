import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as AWS from "aws-sdk";
import { JSONResponse } from "../format";

const S3 = new AWS.S3({});

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (!event.pathParameters?.key) return JSONResponse({ error: "event.pathParamters.key must be set"}, 422)

  const result = await S3.getObject({
    Bucket: process.env.S3_BUCKET as string,
    Key: `interpretation/${event.pathParameters.key}`
  }).promise()

  if (!result.Body) return JSONResponse({ error: "S3Object cannot be read"}, 422)

  const interpretation = JSON.parse(result.Body.toString("utf8"))

  return JSONResponse({ interpretation })
}