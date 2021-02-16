export default async(url: string, method = "GET", body = null) => {
  // @TODO move out
  const r = await fetch(`https://7njbxcubeb.execute-api.ca-central-1.amazonaws.com${url}`, {
    method,
    body,
    // @TODO
    headers: new Headers({
      'Authorization': 'test'
    })
  })
  return await r.json()
}