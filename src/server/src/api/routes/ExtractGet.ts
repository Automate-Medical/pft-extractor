import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { S3 } from "aws-sdk";
import { JSONResponse as Response } from "../format";
import { get as getExtract } from "../models/Extract";

const S3Client = new S3();

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (!event.pathParameters?.key) return Response({ error: "event.pathParamters.key must be set"}, 422)

  const extract = await getExtract(event.pathParameters.key, process.env.DYNAMODB_TABLE as string)

  return Response({ extract })
}