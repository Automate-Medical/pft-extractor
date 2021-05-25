import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { S3 } from "aws-sdk";
import { JSONResponse as Response } from "../format"
import { create as createExtract } from "../models/Extract";

const S3Client = new S3({});

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (!event.body) return Response({}, 400)

  const { jobTag } = JSON.parse(event.body)

  try {
    const { ID } = await createExtract({ jobTag }, process.env.DYNAMODB_TABLE as string)
    const signedUrl = createPresignedPost(ID)

    return Response({
      ID,
      signedUrl
    })
  } catch (e) {
    console.log(e)
    return Response({ error: "Extract service temporarily unavailable" }, 422)
  }
}

function createPresignedPost(ID: string) {
  const params = {
    Expires: 60,
    Bucket: process.env.S3_BUCKET,
    Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
    Fields: {
      "Content-Type": "application/pdf",
      key: `ingress/${ID}`
    }
  }

  return S3Client.createPresignedPost(params)
}