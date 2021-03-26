import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Callback, Context } from "aws-lambda";
import AWS from "aws-sdk";
import formatResponse from "../format";

const DynamoDB = new AWS.DynamoDB();

interface APIListDocumentsListItem {
  key: string | undefined;
  lastModified: string | undefined;
  stage: string | undefined;
  jobTag: string | undefined;
}

// @todo make use of callback?
export const ExtractIndex: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  if (!process.env.S3_BUCKET) {
    return formatResponse(JSON.stringify({
      error: `S3_BUCKET not available`
    }), 500)
  }

  const filter = event.queryStringParameters?.filter && event.queryStringParameters?.filter != "ALL" ?
    event.queryStringParameters.filter : false;

  // @done scan
  // @done filter
  // @done sort (client side)
  // @todo pagination?
  // @todo error handling
  // @done format response

  try {
    let input: any = {
      TableName: "Extracts"
    }

    if (filter) {
      input = {
        ...input,
        FilterExpression: "Stage = :stage",
        ExpressionAttributeValues: { ":stage": { S: filter }}
      }
    }

    const response = await DynamoDB.scan(input).promise()

    const list: APIListDocumentsListItem[] = response.Items ? response.Items.map((item) => {
      return {
        key: item.UUID.S,
        lastModified: item.ModifiedAt.S,
        stage: item.Stage.S,
        jobTag: item.JobTag?.S,
      }
    }) : []

    return formatResponse(JSON.stringify({
      list
    }))

  } catch(e) {
    console.error(e)
    return formatResponse(JSON.stringify({
      error: "A list of Extracts could be not be accessed at this time."
    }), 422)
  }
};

export default ExtractIndex;