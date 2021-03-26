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
    if (!process.env.S3_BUCKET) {
        return callback("S3_BUCKET");
    }
    const Message = JSON.parse(event.Records[0].Sns.Message);
    if (Message.Status == "SUCCEEDED") {
        const key = Message.DocumentLocation.S3ObjectName.split("/")[1];
        await updateExtractStage(key, "SCANNED");
        const job = await Textract.getDocumentAnalysis({ JobId: Message.JobId }).promise();
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `save-textract-output/${key}`,
            Body: JSON.stringify(job),
            ContentType: 'application/json; charset=utf-8',
        };
        await S3.upload(params).promise();
    }
    else {
        const key = Message.DocumentLocation.S3ObjectName.split("/")[1];
        await updateExtractStage(key, "ERROR");
    }
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
