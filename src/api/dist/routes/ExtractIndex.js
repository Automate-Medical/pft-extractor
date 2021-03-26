"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractIndex = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const format_1 = __importDefault(require("../format"));
const DynamoDB = new aws_sdk_1.default.DynamoDB();
// @todo make use of callback?
const ExtractIndex = async (event, context, callback) => {
    if (!process.env.S3_BUCKET) {
        return format_1.default(JSON.stringify({
            error: `S3_BUCKET not available`
        }), 500);
    }
    const filter = event.queryStringParameters?.filter && event.queryStringParameters?.filter != "ALL" ?
        event.queryStringParameters.filter : false;
    // @done scan
    // @done filter
    // @done sort (client side)
    // @todo pagination?
    // @todo error handling
    // @done format response
    try {
        let input = {
            TableName: "Extracts"
        };
        if (filter) {
            input = {
                ...input,
                FilterExpression: "Stage = :stage",
                ExpressionAttributeValues: { ":stage": { S: filter } }
            };
        }
        const response = await DynamoDB.scan(input).promise();
        const list = response.Items ? response.Items.map((item) => {
            return {
                key: item.UUID.S,
                lastModified: item.ModifiedAt.S,
                stage: item.Stage.S,
                jobTag: item.JobTag?.S,
            };
        }) : [];
        return format_1.default(JSON.stringify({
            list
        }));
    }
    catch (e) {
        console.error(e);
        return format_1.default(JSON.stringify({
            error: "A list of Extracts could be not be accessed at this time."
        }), 422);
    }
};
exports.ExtractIndex = ExtractIndex;
exports.default = exports.ExtractIndex;
