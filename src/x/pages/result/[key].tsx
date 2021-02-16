import Head from 'next/head'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import api from '../../lib/api'
import React, { Fragment } from 'react'
import { Card, H2, H3, H4, H5, HTMLTable, Spinner, Tab, Tabs, Tag } from '@blueprintjs/core'
import styles from "./[key].module.scss"
import { INTENT_PRIMARY } from '@blueprintjs/core/lib/esm/common/classes'

export default function Result() {
  const router = useRouter()
  const { key } = router.query

  const { data, error } = useSWR(`/egress/${key}`, api)
  
  function Raw() {
    return (<pre className={styles.Pre}>{JSON.stringify(data.egress, null, 2) }</pre>)
  }

  function Table() {
    return (
      <section>
        <H5>Tests</H5>
        <HTMLTable condensed={true} bordered={true} className={styles.Table}>
          <thead>
            <tr>
              <th>Group</th>
              <th>Key</th>
              <th>LOINC Code</th>
              <th>Common Name</th>  
              <th>Predicted</th>
              <th>LLN</th> 
              <th>ULN</th>
              <th>Best Pre</th> 
              <th>Best Post</th> 
            </tr>
          </thead>
          <tbody>
            { Object.keys(data.egress).map((group) => {
              if (group == "meta") return null;

              return Object.keys(data.egress[group]).map((key) => {
                const row = data.egress[group][key]
                return (
                  <tr>
                    <td><Tag>{group}</Tag></td>
                    <td><Tag intent="primary"><strong>{key}</strong></Tag></td>
                    <td><a href={`https://loinc.org/${row.meta.loinc}/`}>{row.meta.loinc}</a></td>
                    <td>{row.meta.commonName}</td>
                    <td>{row.predicted}</td>
                    <td>{row.lln}</td>
                    <td>{row.uln}</td>
                    <td><strong>{row.pre}</strong></td>
                    <td>{row.post}</td>
                  </tr>
                )
              })
            })}
          </tbody>
        </HTMLTable>

        
        { data.egress.meta?.comment ? (
          <Fragment>
            <H5>Technician Commentary</H5>
            <p>{data.egress.meta?.comment}</p>
          </Fragment>
        ) : null }
      </section>
    )
  }

  function Preview() {
    return <object
      type="application/pdf"
      data={data.ingressUrl}
      width="500"
      height="1000"
    ></object>
  }

  function Data() {
    return (
      <section className={styles.Main}>
        <Card>
          <Preview />
        </Card>
        <Card>
          <H3>Key: {key}</H3>
          <H4>Extraction Stages</H4>
          <p><Tag intent="success">Ingress</Tag> <code> s3://pft-extractor-ingress/{key}</code></p>
          <p><Tag intent="success">Textract</Tag><code> s3://pft-extractor-textract/{key}</code></p>
          <p><Tag intent="success">Egress</Tag><code> s3://pft-extractor-egress/{key}</code></p>

          <H4>Extraction Result</H4>
          <Tabs id="Tabs" defaultSelectedTabId="loinc">
            <Tab id="loinc" title="Structured Data" panel={<Table />} />
            <Tab id="raw" title="Raw JSON" panel={<Raw />} />
            <Tab id="csv" title="Comma Separated Values" panel={<p>test</p>} />
          </Tabs>
        </Card>
      </section>
    )
  }

  return (
    <div className="container">
      <Head>
        <title>X - Egress</title>
      </Head>
      <main>
        {data ? <Data />: <Spinner />}
      </main>
    </div>
  )
}
