"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const format_1 = __importDefault(require("../format"));
const S3 = new aws_sdk_1.default.S3({});
const DynamoDB = new aws_sdk_1.default.DynamoDB();
// @todo these should be callbacks
const NewExtract = async (event, context, callback) => {
    if (!process.env.S3_BUCKET)
        return format_1.default("Missing S3_BUCKET");
    if (!event.body)
        return format_1.default("Missing event body");
    const { key, jobTag } = JSON.parse(event.body);
    // @todo what happens on failure?
    await createExtract({ key, jobTag });
    const signedUrl = createPresignedPost(key);
    return format_1.default(JSON.stringify({
        uuid: key,
        signedUrl
    }));
};
exports.default = NewExtract;
async function createExtract(params, TableName = "Extracts") {
    let Item = {
        UUID: {
            S: params.key
        },
        Stage: {
            S: "NEW"
        },
        ModifiedAt: {
            S: new Date().toISOString()
        }
    };
    if (params.jobTag)
        Item = { ...Item, JobTag: { S: params.jobTag } };
    const itemParams = { Item, TableName };
    return await DynamoDB.putItem(itemParams).promise();
}
function createPresignedPost(key) {
    const params = {
        Expires: 60,
        Bucket: process.env.S3_BUCKET,
        Conditions: [["content-length-range", 100, 10000000]],
        Fields: {
            "Content-Type": "application/pdf",
            key: `ingress/${key}`
        }
    };
    return S3.createPresignedPost(params);
}
