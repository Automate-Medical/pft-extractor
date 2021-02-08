import AWS from "aws-sdk";
import { Context, Callback } from 'aws-lambda';

const S3 = new AWS.S3({});

// @todo fix any type here
export const handler = (event: any, context: Context, callback: Callback) => {
  console.info("initializing authorizer");

  // @todo use JWTs or something instead, this is just a test
  if(event.identitySource && event.identitySource[0] == "test") {
    callback(null, {
      "isAuthorized": true
    })
  } else {
    callback(null, {
      "isAuthorized": false
    })
  }
}