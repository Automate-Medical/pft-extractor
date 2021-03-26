"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretationGet = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const format_1 = __importDefault(require("../format"));
const S3 = new aws_sdk_1.default.S3({});
const InterpretationGet = async (event, context, callback) => {
    console.info("initializing interpretation");
    if (!process.env.S3_BUCKET || !event.pathParameters?.key) {
        return format_1.default("test unsuccessful");
    }
    const result = await S3.getObject({
        Bucket: process.env.S3_BUCKET,
        Key: `interpretation/${event.pathParameters.key}`
    }).promise();
    // @ts-ignore
    const interpretation = JSON.parse(Buffer.from(result.Body).toString("utf8"));
    return format_1.default(JSON.stringify({
        interpretation
    }));
};
exports.InterpretationGet = InterpretationGet;
exports.default = exports.InterpretationGet;
