import AWS from "aws-sdk";
import { S3Event, Context, S3Handler, Callback } from 'aws-lambda';

const Textract = new AWS.Textract({})

// @todo make use of callback?
export const handler: S3Handler = async (event: S3Event, context: Context, callback: Callback) => {
  console.info("Initializing lambda-function-ingress");

  if (!process.env.SNS_TOPIC_ARN || !process.env.ROLE_ARN) {
    return callback("SNS_TOPIC_ARN or ROLE_ARN not set")
  }

  const input = {
    "DocumentLocation": {
      "S3Object": {
        "Bucket": event.Records[0].s3.bucket.name,
        "Name": encodeURI(event.Records[0].s3.object.key)
      }
    },
    "NotificationChannel": {
      "SNSTopicArn": process.env.SNS_TOPIC_ARN,
      "RoleArn": process.env.ROLE_ARN
    },
    "JobTag": "pft-extractor-ingress",
    "FeatureTypes": ["TABLES"]
  }

  const response = await new Promise((resolve, reject) => 
    Textract.startDocumentAnalysis(input, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  )

  console.info("Completing lambda-function-ingress");
};