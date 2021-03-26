import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Context } from "aws-lambda";
import AWS from "aws-sdk";
import formatResponse from "./format"

const S3 = new AWS.S3({});
const DynamoDB = new AWS.DynamoDB();

const NewExtract: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  if (!process.env.S3_BUCKET) return callback("Missing S3_BUCKET")
  if (!event.body) return callback("Missing event body")

  const { key } = JSON.parse(event.body)

  await insertUUID(key)

  const params = {
    Expires: 60,
    Bucket: process.env.S3_BUCKET,
    Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
    Fields: {
      "Content-Type": "application/pdf",
      key: `ingress/${key}`
    }
  }

  const signedUrl = S3.createPresignedPost(params)

  return formatResponse(JSON.stringify({
    signedUrl
  }))
}

export default NewExtract;


async function insertUUID(key: string) {
  const item = {
    Item: {
    "UUID": {
      S: key
      },
    "Stage": {
      S: "REQUESTED"
      }
    },
    TableName: "Extracts"
  };

  try {
    await DynamoDB.putItem(item).promise()
  } catch (e) {
    return e
  }
}