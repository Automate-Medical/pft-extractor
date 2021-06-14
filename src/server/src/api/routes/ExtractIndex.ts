import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { JSONResponse } from "../format";

const DynamoDBClient = new DynamoDB();

interface APIListDocumentsListItem {
  key: string | undefined;
  lastModified: string | undefined;
  stage: string | undefined;
  jobTag: string | undefined;
}

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const filter = event.queryStringParameters?.filter && event.queryStringParameters?.filter != "ALL" ?
    event.queryStringParameters.filter : false;

  // @todo sort (client side)
  // @todo pagination?
  // @todo error handling

  try {
    let input: {
      TableName: string;
      FilterExpression?: string;
      ExpressionAttributeValues?: {
        ":stage": {
          S: string
        }
      }
    } = {
      TableName: process.env.DYNAMODB_TABLE as string
    }

    if (filter) {
      input = {
        ...input,
        FilterExpression: "Stage = :stage",
        ExpressionAttributeValues: { ":stage": { S: filter }}
      }
    }

    const response = await DynamoDBClient.scan(input).promise()

    const extracts: APIListDocumentsListItem[] = response.Items ? response.Items.map((item) => {
      return {
        key: item.ID.S,
        lastModified: item.ModifiedAt.S,
        stage: item.Stage.S,
        jobTag: item.JobTag?.S,
      }
    }) : []

    return JSONResponse({ extracts })

  } catch(e) {
    console.error(e)
    return JSONResponse({ error: "A list of Extracts could be not be accessed at this time" }, 422)
  }
};