import Amplify, { Auth } from "aws-amplify"
import AmplifyConfig from "./amplify-config";

Amplify.configure(AmplifyConfig);

const API = async (url: string, method = "GET", body = null) => {
  // @ts-ignore
  const { accessToken } = await Auth.currentSession()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`, {
    method,
    body,
    headers: new Headers({
      'Authorization': accessToken.jwtToken
    })
  })

  return await response.json()
}

export default API;