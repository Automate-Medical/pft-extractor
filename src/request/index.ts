import AWS from "aws-sdk";
import { Context, Callback, APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda';

// import listDocuments from 'src/listDocuments'

const S3 = new AWS.S3({});

interface APIListDocumentsListItem {
  key: string | undefined;
  lastModified: Date | undefined;
  stage: string;
  size: number | undefined;
  storageClass: string | undefined;
  owner: AWS.S3.Owner | undefined;
}

function formatListDocuments(list: AWS.S3.ObjectList, stage: string): APIListDocumentsListItem[] {
  return list.map(item => {
    return {
      key: item.Key?.split("/")[1],
      lastModified: item.LastModified,
      stage,
      size: item.Size,
      storageClass: item.StorageClass,
      owner: item.Owner
    }
  })
}

// @todo make use of callback?
export const listDocuments: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback) => {
  if (!process.env.S3_BUCKET) {
    return formatResponse(JSON.stringify({
      error: `S3_BUCKET not available`
    }), 500)
  }

  console.log(event.queryStringParameters)

  const filter = event.queryStringParameters?.filter ? event.queryStringParameters.filter : "all"

  const ingressObjects = await S3.listObjectsV2({ Bucket: process.env.S3_BUCKET, Prefix: "ingress/" }).promise()
  const egressObjects = await S3.listObjectsV2({ Bucket: process.env.S3_BUCKET, Prefix: "egress/" }).promise()

  if (!ingressObjects.Contents || !egressObjects.Contents) {
    return formatResponse(JSON.stringify({
      error: `Extraction results are temporarily unavailable`
    }), 422)
  }

  const ingressList = formatListDocuments(ingressObjects.Contents, "started");
  const egressList = formatListDocuments(egressObjects.Contents, "finished");

  let list: APIListDocumentsListItem[] = [];

  list = ingressList.map((ingressItem) => {
    const egressItem = egressList.find((egressItem) => egressItem.key == ingressItem.key)
    if (egressItem) {
      return egressItem
    } else {
      return ingressItem
    }
  })

  list = list.sort((a, b) => {
    if (!a.lastModified || !b.lastModified) {
      return 1
    } else if (a.lastModified < b.lastModified) {
      return 1;
    } else {
      return -1;
    }
  })

  list = list.filter((listItem) => {
    if (filter == "all") {
      return true;
    } else {
      return listItem.stage == filter
    }
  })

  return formatResponse(JSON.stringify({
    list
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

function formatResponse(body: string, code = 200){
  let response = {
    "statusCode": code,
    "headers": {
      "Content-Type": "application/json"
    },
    "isBase64Encoded": false,
    "body": body
  }
  return response
}