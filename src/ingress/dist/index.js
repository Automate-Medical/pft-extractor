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
    console.info("Initializing lambda-function-ingress");
    if (!process.env.SNS_TOPIC_ARN || !process.env.ROLE_ARN) {
        return callback("SNS_TOPIC_ARN or ROLE_ARN not set");
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
    };
    const response = await new Promise((resolve, reject) => Textract.startDocumentAnalysis(input, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    }));
    console.info("Completing lambda-function-ingress");
};
exports.handler = handler;
