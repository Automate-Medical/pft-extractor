import Link from 'next/link'
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import useSWR from 'swr'
import api from '../lib/api'
import { Button, Card, Elevation, H1, H2, H3, H4, HTMLTable, Intent, Spinner, Tag } from '@blueprintjs/core';

import styles from "./index.module.scss"
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

function UploadFragment() {
  const [uploading, setUploading] = useState(false)

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async function upload(event) {
    setUploading(true)

    asyncForEach(Array.from(event.target.files), async (file) => {
      const key = uuid()
      const { signedUrl } = await api("/prepare-ingress", "POST", JSON.stringify({ key }))

      let body = new FormData()
      Object.keys(signedUrl.fields).forEach(key => body.append(key, signedUrl.fields[key]))
      // @ts-ignore
      body.append('file', file)

      await fetch(signedUrl.url, { method: "POST", body })
    }).finally(() => {
      setUploading(false)
    })
  }

  if (uploading) {
    return (
      <Spinner />
    )
  }
  else {
    return (
      <input type="file" onChange={(e) => upload(e)} multiple/>
    )
  }
}

export default function Home() {
  const { data: ingress, error: ingressError } = useSWR('/list-ingress', api, { refreshInterval: 1000 })
  const { data: egress, error: egressError } = useSWR('/list-egress', api, { refreshInterval: 1000 })

  let result = ingress?.pfts.map((pft) => {
    let processed = egress?.pfts.filter((processedPft) => processedPft.key == pft.key)
    if (processed?.length) {
      pft.stage = "Processed"
    }
    return pft
  })

  result = result?.sort((a, b) => {
    if (new Date(a.lastModified) < new Date(b.lastModified) ) {
      return 1;
    }
    if ( new Date(a.lastModified) > new Date(b.lastModified) ) {
      return -1;
    }
  })


  function Row({ pft }) {
    return (
      <tr key={pft.key}>
        <td>{pft.stage == "Uploaded" ? <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} /> : null}</td>
        <td>{ pft.stage == "Processed" ? <Link href={`/result/${pft.key}`}>{pft.key}</Link> : pft.key}</td>
        <td><Tag intent={pft.stage == "Uploaded" ? Intent.PRIMARY : Intent.SUCCESS}>{pft.stage}</Tag></td>
        <td>{pft.lastModified}</td>
      </tr>
    )
  }

  return (
    <main className={styles.Main}>
      <section>
        <Card interactive={true} elevation={Elevation.TWO}>
          <H4>Automatic processing </H4>
          <p>Automatic processing stage is live and has an active connection.</p>
          <code>s3://pft-extractor-ingress </code><Tag intent={Intent.SUCCESS}>Live</Tag>
        </Card>
        <Card interactive={true} elevation={Elevation.TWO} style={{marginTop: 20}}>
          <H4>Upload to process</H4>
          <p>Select a PFT in PDF format to process.</p>
          <UploadFragment />
        </Card>
      </section>
      <Card>
        <H2>Processed PFTs</H2>
        { result ?
          <HTMLTable striped={true} className={styles.Table}>
            <thead>
              <tr>
                <th style={{width: 50}}></th>
                <th>UUID</th>
                <th>Stage</th>
                <th>Uploaded</th>
              </tr>
            </thead>

            <tbody>
              { result.map(pft => {
                return (<Row pft={pft} key={pft.key} />)
              }) }
            </tbody>
          </HTMLTable>
        : <Spinner />}
      </Card>
    </main>
  )
}
