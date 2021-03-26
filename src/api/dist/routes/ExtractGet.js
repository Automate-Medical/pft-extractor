"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractGet = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const format_1 = __importDefault(require("../format"));
const S3 = new aws_sdk_1.default.S3({});
const ExtractGet = async (event, context, callback) => {
    console.info("initializing egress-result");
    if (!process.env.S3_BUCKET || !event.pathParameters?.key) {
        return format_1.default("test unsuccessful");
    }
    const result = await S3.getObject({
        Bucket: process.env.S3_BUCKET,
        Key: `egress/${event.pathParameters.key}`
    }).promise();
    // @ts-ignore
    const egress = JSON.parse(Buffer.from(result.Body).toString("utf8"));
    const ingressUrl = await S3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET,
        Key: `ingress/${event.pathParameters.key}`
    });
    return format_1.default(JSON.stringify({
        result: egress,
        meta: {
            key: event.pathParameters.key,
            lastModified: result.LastModified,
            versionId: result.VersionId,
            replicationStatus: result.ReplicationStatus,
            ingressUrl
        }
    }));
};
exports.ExtractGet = ExtractGet;
exports.default = exports.ExtractGet;
