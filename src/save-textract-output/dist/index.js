"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const S3 = new aws_sdk_1.default.S3({});
const Textract = new aws_sdk_1.default.Textract({});
// @todo make use of callback?
const handler = async (event, context, callback) => {
    console.info("initializing save-textract-output");
    if (!process.env.S3_BUCKET) {
        return callback("S3_BUCKET");
    }
    const Message = JSON.parse(event.Records[0].Sns.Message);
    if (Message.Status == "SUCCEEDED") {
        const job = await Textract.getDocumentAnalysis({ JobId: Message.JobId }).promise();
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `save-textract-output/${Message.DocumentLocation.S3ObjectName.split("/")[1]}`,
            Body: JSON.stringify(job),
            ContentType: 'application/json; charset=utf-8',
        };
        const response = await S3.upload(params).promise();
    }
};
exports.handler = handler;
