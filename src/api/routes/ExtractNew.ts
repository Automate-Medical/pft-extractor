import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Callback, Context } from "aws-lambda";
import AWS from "aws-sdk";
import formatResponse from "../format"

const S3 = new AWS.S3({});
const DynamoDB = new AWS.DynamoDB();

// @todo these should be callbacks
const NewExtract: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  if (!process.env.S3_BUCKET) return formatResponse("Missing S3_BUCKET")
  if (!event.body) return formatResponse("Missing event body")

  const { key, jobTag } = JSON.parse(event.body)

  // @todo what happens on failure?
  await createExtract({ key, jobTag })

  const signedUrl = createPresignedPost(key)

  return formatResponse(JSON.stringify({
    uuid: key,
    signedUrl
  }))
}

export default NewExtract;

interface INewExtract {
  key: string;
  jobTag?: string;
}

async function createExtract(params: INewExtract, TableName = "Extracts") {
  let Item: any = {
    UUID: {
      S: params.key
    },
    Stage: {
      S: "NEW"
    },
    ModifiedAt: {
      S: new Date().toISOString()
    }
  }

  if (params.jobTag) Item = { ...Item, JobTag: { S: params.jobTag } }

  const itemParams = { Item, TableName };

  return await DynamoDB.putItem(itemParams).promise()
}

function createPresignedPost(key: string) {
  const params = {
    Expires: 60,
    Bucket: process.env.S3_BUCKET,
    Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
    Fields: {
      "Content-Type": "application/pdf",
      key: `ingress/${key}`
    }
  }

  return S3.createPresignedPost(params)
}