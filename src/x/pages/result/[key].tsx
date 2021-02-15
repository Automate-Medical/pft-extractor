import Head from 'next/head'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import api from '../../lib/api'
import React from 'react'
import { Card, Spinner, Tab, Tabs } from '@blueprintjs/core'
import styles from "./[key].module.scss"

export default function Result() {
  const router = useRouter()
  const { key } = router.query

  const { data, error } = useSWR(`/egress/${key}`, api)
  
  function Raw() {
    return (<pre>{JSON.stringify(data.egress, null, 2) }</pre>)
  }

  function Data() {
    return (
      <section className={styles.Main}>
        <Card>
          <object
            type="application/pdf"
            data={data.ingressUrl}
            width="600"
            height="1000"
          ></object>
        </Card>
        
        <Card>
          <h2>{key}</h2>
          <Tabs id="Tabs" selectedTabId="raw">
            <Tab id="raw" title="Raw Preview" panel={<Raw />} />
            <Tab id="lonic" title="LOINC Annotated" panel={<p>test</p>} />
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
