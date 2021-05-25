import api from "./api";

export async function newExtract(filesToUpload: FileList, jobTag?: string) {
  const { signedUrl, ID } = await api("/extract/new", "POST", JSON.stringify({ jobTag }))

  let body = new FormData()
  Object.keys(signedUrl.fields).forEach(key => body.append(key, signedUrl.fields[key]))
  // @ts-ignore
  body.append('file', filesToUpload[0])

  await fetch(signedUrl.url, { method: "POST", body })

  return { signedUrl, ID }
}
