import React, { Fragment, useState } from 'react'

import Head from 'next/head'
import useSWR from 'swr'
import api from '../../lib/api'

import styles from "./[uuid].module.scss"

import { AnchorButton, Button, ButtonGroup, Card, H3, H4, H5, HTMLTable, InputGroup, Spinner, Tab, Tabs, Tag } from '@blueprintjs/core'
import { PFT, PFTElementType as PFTType, PFTElement  } from '../../types'
import { useRouter } from 'next/router'

interface IEgressResponseData {
  egress: PFT,
  ingressUrl: string
}

function Structured({ data }: { data: IEgressResponseData }) {
  const [groupFilter, setGroupFilter] = useState<string>(null)
  const [typeFilter, setTypeFilter] = useState<string>('')

  function FilterButton({ group }) {
    return (
      <Button
        onClick={() => {
          groupFilter == group ? setGroupFilter(null) : setGroupFilter(group)
        }}
        active={groupFilter == group ? true : false}>
          {group}
      </Button>
    )
  }

  return (
    <Fragment>
      <section className={styles.Filters}>
        <section>
          <H5>Filter by group</H5>
          <ButtonGroup>
            <FilterButton group={"Spirometry"}/>
            <FilterButton group={"Diffusion Capacity"}/>
            <FilterButton group={"Quality"}/>
          </ButtonGroup>
        </section>
        <section>
          <H5>Filter by Key</H5>
          <InputGroup
              key={`type-filter`}
              asyncControl={true}
              onChange={(e) => setTimeout(() => { setTypeFilter(e.target.value) }, 10)}
              placeholder="Regexp type filter"
              value={typeFilter}
          />
        </section>
      </section>

      <HTMLTable condensed={true} bordered={true} className={styles.Table} striped={true}>
        <thead>
          <tr>
            <th>Group</th>
            <th>Key</th>
            <th>LOINC</th>
            <th>Short Name</th>
            <th>Value</th>
            <th>Units</th>
          </tr>
        </thead>
        <tbody>
          { data.egress.elements.filter((e) => {
              return (groupFilter ? e.meta.group == groupFilter : true) && (typeFilter ? e.meta.type.match(typeFilter) : true)
            }).map((element: PFTElement) => {
            return (
              <tr key={element.meta.type}>
                <td><Tag>{element.meta.group}</Tag></td>
                <td><Tag intent="primary"><strong>{element.meta.type}</strong></Tag></td>
                <td>{ element.meta.loinc ? (<a href={`https://loinc.org/${element.meta.loinc}/`}><Tag intent="success" round={true}>{element.meta.loinc}</Tag></a>) : null }</td>
                <td>{element.meta.shortName}</td>
                <td>{element.value}</td>
                <td>{element.meta.units}</td>
              </tr>
            )
          })}
        </tbody>
      </HTMLTable>
    </Fragment>
  )
}

function Interpretation({ uuid }) {
  const { data, error }: {
    data?: { interpretation },
    error?: any
  } = useSWR(uuid ? `/interpretation/${uuid}` : null, api)

  return (
    <Fragment>
      <ul className={styles.StepProgress}>
        { data?.interpretation?.map((step: any) => {
          return (
            <li className={styles.StepProgressItem}><strong>{step.label}</strong></li>
          )
        })}

      </ul>

      <pre className={styles.Pre}>
        {JSON.stringify(data, null, 2) }
      </pre>
    </Fragment>

  )
}

export default function Result() {
  const router = useRouter()
  const { uuid } = router.query

  const { data, error }: {
    data?: IEgressResponseData,
    error?: any
  } = useSWR(uuid ? `/egress/${uuid}` : null, api)

  function Stages() {
    return (
      <Fragment>
        <H4>Extraction Stages</H4>
        <p><Tag>Ingress</Tag> <code> s3://pft-extractor-ingress/{uuid}</code></p>
        <p><Tag>Textract</Tag><code> s3://pft-extractor-textract/{uuid}</code></p>
        <p><Tag>Egress</Tag><code> s3://pft-extractor-egress/{uuid}</code></p>
      </Fragment>
    )
  }

  function Data() {
    return (
      <Fragment>
        <H4>Extraction Result <AnchorButton href={data?.ingressUrl} text="Original" rightIcon="folder-shared-open" /></H4>
        <Tabs id="Tabs" defaultSelectedTabId="structured">
          <Tab id="structured" title="Structured Data" panel={<Structured data={data}/>} />
          <Tab id="interpretation" title="Interpretation" panel={<Interpretation uuid={uuid} />} />
          <Tab id="raw" title="Raw JSON" panel={<pre className={styles.Pre}>{JSON.stringify(data, null, 2) }</pre>} />
          <Tab id="stages" title="Extraction Stages" panel={<Stages />} />
        </Tabs>
      </Fragment>
    )
  }

  return (
    <div className="container">
      <Head>
        <title>X - Egress</title>
      </Head>
      <main>
        <section className={styles.Main}>
          <Card>
            <H3>uuid: {uuid}</H3>
            {data ? <Data />: <Spinner />}
          </Card>
        </section>
      </main>
    </div>
  )
}
