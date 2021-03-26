"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatResponse(body, code = 200) {
    let response = {
        "statusCode": code,
        "headers": {
            "Content-Type": "application/json"
        },
        "isBase64Encoded": false,
        "body": body
    };
    return response;
}
exports.default = formatResponse;
