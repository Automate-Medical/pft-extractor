"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const transform_1 = __importDefault(require("./transform"));
const S3 = new aws_sdk_1.default.S3({});
// @todo make use of callback?
const handler = async (event, context, callback) => {
    console.info("Initializing lambda-function-transform");
    if (!process.env.S3_BUCKET) {
        return callback("S3_BUCKET");
    }
    const Bucket = event.Records[0].s3.bucket.name;
    const Key = event.Records[0].s3.object.key;
    try {
        const response = await S3.getObject({ Bucket, Key }).promise();
        // @ts-ignore
        const json = JSON.parse(response.Body.toString());
        const transformation = transform_1.default(json);
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `egress/${Key.split("/")[1]}`,
            Body: JSON.stringify(transformation),
            ContentType: 'application/json; charset=utf-8',
        };
        await S3.upload(params).promise();
    }
    catch (e) {
        console.log("FAILED");
    }
    console.info("Completing lambda-function-transform");
};
exports.handler = handler;
