interface IJSONResponse {
  statusCode: number;
  headers: {
    "Content-Type": "application/json"
  };
  isBase64Encoded: false;
  body: string;
}

export function JSONResponse(body: Record<string, unknown>, code = 200): IJSONResponse {
  return {
    statusCode: code,
    headers: {
      "Content-Type": "application/json"
    },
    isBase64Encoded: false,
    body: JSON.stringify(body)
  }
}