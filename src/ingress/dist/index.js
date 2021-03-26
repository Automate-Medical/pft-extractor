"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Textract = new aws_sdk_1.default.Textract({});
// @todo make use of callback?
const handler = async (event, context, callback) => {
    if (!process.env.SNS_TOPIC_ARN || !process.env.ROLE_ARN) {
        return callback("SNS_TOPIC_ARN or ROLE_ARN not set");
    }
    const key = event.Records[0].s3.object.key.split("/")[1];
    await updateExtractStage(key, "STARTED");
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
    };
    await Textract.startDocumentAnalysis(input).promise();
};
exports.handler = handler;
async function updateExtractStage(key, stage) {
    const DynamoDB = new aws_sdk_1.default.DynamoDB();
    var dbInput = {
        AttributeUpdates: {
            Stage: {
                Action: "PUT",
                Value: {
                    S: stage
                }
            },
            ModifiedAt: {
                Action: "PUT",
                Value: {
                    S: new Date().toISOString()
                }
            }
        },
        Key: {
            UUID: {
                S: key
            }
        },
        TableName: "Extracts"
    };
    return await DynamoDB.updateItem(dbInput).promise();
}
