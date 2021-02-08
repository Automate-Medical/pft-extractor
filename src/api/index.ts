import AWS from "aws-sdk";
import { Context, Callback, APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda';

const S3 = new AWS.S3({});

// @todo make use of callback?
export const listEgress: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  console.info("initializing list-egress");

  if (!process.env.S3_BUCKET_EGRESS) {
    return formatResponse("test unsuccessful")
  }

  const list = await S3.listObjectsV2({ Bucket: process.env.S3_BUCKET_EGRESS }).promise()

  const items = list.Contents?.map(item => {
    return {
      key: item.Key,
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

  if (!process.env.S3_BUCKET_INGRESS) {
    return formatResponse("test unsuccessful")
  }

  const list = await S3.listObjectsV2({ Bucket: process.env.S3_BUCKET_INGRESS }).promise()

  const items = list.Contents?.map(item => {
    return {
      key: item.Key,
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

  if (!process.env.S3_BUCKET_INGRESS || !event.body) {
    return formatResponse("test unsuccessful")
  }

  const { key } = JSON.parse(event.body)
 
  const params = {
    Expires: 60,
    Bucket: process.env.S3_BUCKET_INGRESS,
    Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
    Fields: {
      "Content-Type": "application/pdf",
      key
    }
  }

  const signedUrl = S3.createPresignedPost(params)
  
  return formatResponse(JSON.stringify({
    signedUrl
  })) 
}

export const egressResult: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  console.info("initializing egress-result");

  if (!process.env.S3_BUCKET_EGRESS || !event.pathParameters?.key) {
    return formatResponse("test unsuccessful")
  }

  const result = await S3.getObject({
    Bucket: process.env.S3_BUCKET_EGRESS,
    Key: event.pathParameters.key
  }).promise()

  // @ts-ignore
  const egress = JSON.parse(Buffer.from(result.Body).toString("utf8"))

  const ingressUrl = await S3.getSignedUrl("getObject", {
    Bucket: process.env.S3_BUCKET_INGRESS,
    Key: event.pathParameters.key
  })

  return formatResponse(JSON.stringify({
    egress,
    ingressUrl
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