export default function formatResponse(body: string, code = 200){
  let response = {
    "statusCode": code,
    "headers": {
      "Content-Type": "application/json"
    },
    "isBase64Encoded": false,
    "body": body
  }
  return response
}