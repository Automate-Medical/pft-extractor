"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// @todo fix any type here
const handler = (event, context, callback) => {
    console.info("initializing authorize");
    // @todo use JWTs or something instead, this is just a test
    if (event.identitySource && event.identitySource[0] == "test2") {
        callback(null, {
            "isAuthorized": true
        });
    }
    else {
        callback(null, {
            "isAuthorized": false
        });
    }
};
exports.handler = handler;
