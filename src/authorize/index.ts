import { Context, Callback } from 'aws-lambda';

// @todo fix any type here
export const handler = (event: any, context: Context, callback: Callback) => {
  console.info("initializing authorize");

  // @todo use JWTs or something instead, this is just a test
  if(event.identitySource && event.identitySource[0] == "test2") {
    callback(null, {
      "isAuthorized": true
    })
  } else {
    callback(null, {
      "isAuthorized": false
    })
  }
}