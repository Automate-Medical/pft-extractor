import AWS from "aws-sdk";
import { Context, Callback, APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda';

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});

// @todo make use of callback?
export const listEgress: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  console.info("initializing list-egress");

  if (!process.env.S3_BUCKET) {
    return formatResponse("test unsuccessful")
  }

  const list = await S3.listObjectsV2({ Bucket: process.env.S3_BUCKET, Prefix: "egress/" }).promise()

  const items = list.Contents?.map(item => {
    return {
      key: item.Key?.split("/")[1],
      lastModified: item.LastModified,
      stage: "Processed"
    }
  })

  return formatResponse(JSON.stringify({
    pfts: items
  }))
};

// @todo make use of callback?
export const listIngress: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  console.info("initializing list-ingress");

  if (!process.env.S3_BUCKET) {
    return formatResponse("test unsuccessful")
  }

  const list = await S3.listObjectsV2({ Bucket: process.env.S3_BUCKET, Prefix: "ingress/" }).promise()

  const items = list.Contents?.map(item => {
    return {
      key: item.Key?.split("/")[1],
      lastModified: item.LastModified,
      stage: "Uploaded"
    }
  })

  return formatResponse(JSON.stringify({
    pfts: items
  }))
};

export const prepareIngress: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  console.info("initializing prepare-ingress");

  if (!process.env.S3_BUCKET || !event.body) {
    return formatResponse("test unsuccessful")
  }

  const { key } = JSON.parse(event.body)

  const params = {
    Expires: 60,
    Bucket: process.env.S3_BUCKET,
    Conditions: [["content-length-range", 100, 100000000]], // 100Byte - 100MB
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

export const egressResult: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
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
    egress,
    ingressUrl
  }))
}

export const interpretation: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
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

function formatResponse(body: string){
  let response = {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "isBase64Encoded": false,
    "body": body
  }
  return response
}