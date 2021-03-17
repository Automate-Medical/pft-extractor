"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpretation = exports.egressResult = exports.prepareIngress = exports.listIngress = exports.listEgress = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const S3 = new aws_sdk_1.default.S3({
    signatureVersion: 'v4'
});
// @todo make use of callback?
const listEgress = async (event, context, callback) => {
    console.info("initializing list-egress");
    if (!process.env.S3_BUCKET) {
        return formatResponse("test unsuccessful");
    }
    const list = await S3.listObjectsV2({ Bucket: process.env.S3_BUCKET, Prefix: "egress/" }).promise();
    const items = list.Contents?.map(item => {
        return {
            key: item.Key?.split("/")[1],
            lastModified: item.LastModified,
            stage: "Processed"
        };
    });
    return formatResponse(JSON.stringify({
        pfts: items
    }));
};
exports.listEgress = listEgress;
// @todo make use of callback?
const listIngress = async (event, context, callback) => {
    console.info("initializing list-ingress");
    if (!process.env.S3_BUCKET) {
        return formatResponse("test unsuccessful");
    }
    const list = await S3.listObjectsV2({ Bucket: process.env.S3_BUCKET, Prefix: "ingress/" }).promise();
    const items = list.Contents?.map(item => {
        return {
            key: item.Key?.split("/")[1],
            lastModified: item.LastModified,
            stage: "Uploaded"
        };
    });
    return formatResponse(JSON.stringify({
        pfts: items
    }));
};
exports.listIngress = listIngress;
const prepareIngress = async (event, context, callback) => {
    console.info("initializing prepare-ingress");
    if (!process.env.S3_BUCKET || !event.body) {
        return formatResponse("test unsuccessful");
    }
    const { key } = JSON.parse(event.body);
    const params = {
        Expires: 60,
        Bucket: process.env.S3_BUCKET,
        Conditions: [["content-length-range", 100, 10000000]],
        Fields: {
            "Content-Type": "application/pdf",
            key: `ingress/${key}`
        }
    };
    const signedUrl = S3.createPresignedPost(params);
    return formatResponse(JSON.stringify({
        signedUrl
    }));
};
exports.prepareIngress = prepareIngress;
const egressResult = async (event, context, callback) => {
    console.info("initializing egress-result");
    if (!process.env.S3_BUCKET || !event.pathParameters?.key) {
        return formatResponse("test unsuccessful");
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
    return formatResponse(JSON.stringify({
        egress,
        ingressUrl
    }));
};
exports.egressResult = egressResult;
const interpretation = async (event, context, callback) => {
    console.info("initializing interpretation");
    if (!process.env.S3_BUCKET || !event.pathParameters?.key) {
        return formatResponse("test unsuccessful");
    }
    const result = await S3.getObject({
        Bucket: process.env.S3_BUCKET,
        Key: `interpretation/${event.pathParameters.key}`
    }).promise();
    // @ts-ignore
    const interpretation = JSON.parse(Buffer.from(result.Body).toString("utf8"));
    return formatResponse(JSON.stringify({
        interpretation
    }));
};
exports.interpretation = interpretation;
function formatResponse(body) {
    let response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "isBase64Encoded": false,
        "body": body
    };
    return response;
}
