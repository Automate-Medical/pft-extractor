export default async(url: string, method = "GET", body = null) => {
  const r = await fetch(`https://7njbxcubeb.execute-api.ca-central-1.amazonaws.com${url}`, {
    method,
    body,
    headers: new Headers({
      'Authorization': 'test'
    })
  })
  return await r.json()
}