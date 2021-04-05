import api from "./api";
import { v4 as uuid } from 'uuid';

async function asyncForEach(array, callback) {
  return array.map(async (item) => {
    return await callback(item);
  })
}

export function newExtracts(filesToUpload: FileList, jobTag?: string): Promise<Response[]> {
  return asyncForEach(Array.from(filesToUpload), async (file) => {
    const key = uuid()
    const { signedUrl } = await api("/extract/new", "POST", JSON.stringify({ key, jobTag }))

    let body = new FormData()
    Object.keys(signedUrl.fields).forEach(key => body.append(key, signedUrl.fields[key]))
    // @ts-ignore
    body.append('file', file)

    const response = await fetch(signedUrl.url, { method: "POST", body })

    return response
  })
}
