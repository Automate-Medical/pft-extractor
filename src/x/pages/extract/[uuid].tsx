import React, { Fragment, useState } from 'react'

import useSWR from 'swr'
import api from '../../lib/api'

import styles from "./[uuid].module.scss"

import { AnchorButton, Button, ButtonGroup, Card, Checkbox, Collapse, Divider, H2, H3, H4, H5, HTMLTable, InputGroup, Position, Spinner, Tab, Tabs, Tag, Tooltip } from '@blueprintjs/core'
import { PFT, PFTElementType as PFTType, PFTElement  } from '../../../types'
import { useRouter } from 'next/router'

interface IEgressResponseData {
  result: PFT;
  meta: {
    key: string;
    lastModified: string;
    versionId: string;
    replicationStatus: string;
    ingressUrl: string;
  }
}

function Structured({ data }: { data: IEgressResponseData }) {
  const [groupFilter, setGroupFilter] = useState<string>(null)
  const [transformBuffer, setTransformBuffer] = useState<PFTType[]>([])

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
          <ButtonGroup>
            <FilterButton group={"Spirometry"}/>
            <FilterButton group={"Diffusion Capacity"}/>
            <FilterButton group={"Quality"}/>
          </ButtonGroup>
          <Button text="Add to transform" disabled={true} intent="primary" icon="download" style={{ marginLeft: '10px' }}/>
        </section>
      </section>

      <HTMLTable condensed={true} bordered={true} className={styles.Table} striped={true}>
        <thead>
          <tr>
            <th></th>
            <th>Group</th>
            <th>Key</th>
            <th>LOINC</th>
            <th>Short Name</th>
            <th>Value</th>
            <th>Units</th>
          </tr>
        </thead>
        <tbody>
          { data.result.elements.filter((e) => {
              return (groupFilter ? e.meta.group == groupFilter : true)
            }).map((element: PFTElement) => {
            return (
              <tr key={element.meta.type}>
                <td><Checkbox disabled={true} large={true} onChange={(e) => setTransformBuffer([element.meta.type].concat(transformBuffer))}/></td>
                <td><Tag minimal={true} round={true}>{element.meta.group}</Tag></td>
                <td><Tag intent="primary" minimal={true} round={true}><strong>{element.meta.type}</strong></Tag></td>
                <td>{ element.meta.loinc ? (<a href={`https://loinc.org/${element.meta.loinc}/`}><Tag intent="success" >{element.meta.loinc}</Tag></a>) : null }</td>
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

  const [showWork, setShowWork] = useState(false)

  return (
    <Fragment>
        <H4>Transforms <AnchorButton small={true} minimal={true} disabled={true} text="Show All" href="/transform/" rightIcon="property" /></H4>
        <H5>Spirometry Interpretation <AnchorButton small={true} text="Show Source" href="https://www.aafp.org/afp/2014/0301/afp20140301p359.pdf" rightIcon="folder-shared-open" target="_blank" />        <Button small={true} minimal={true} rightIcon="property" onClick={() => setShowWork(!showWork)}>{showWork ? "Hide Work" : "Show Work"}</Button>
</H5>

      <p>
        {data?.interpretation?.summary}
      </p>
      <Collapse isOpen={showWork}>
        <ul className={styles.StepProgress}>
          { data?.interpretation?.summary.split(".").map((step: any) => {
            return (
              <li className={styles.StepProgressItem}><strong>{step}</strong></li>
            )
          })}
        </ul>
      </Collapse>
      <H5>JSON <AnchorButton small={true} text="Download" href="/" rightIcon="download" disabled={true} target="_blank" /></H5>


    </Fragment>
  )
}

export default function Result() {
  const router = useRouter()
  const { uuid } = router.query

  const { data, error }: {
    data?: IEgressResponseData,
    error?: any
  } = useSWR(uuid ? `/extract/result/${uuid}` : null, api)

  function Data() {
    return (
      <section className={styles.Data}>
        <H3>{uuid}</H3>
        <Divider className={styles.Divider}/>
        <Interpretation uuid={uuid} />
        <Structured data={data}/>
      </section>
    )
  }

  return (
    <main className={styles.Main}>
      <H2>Extraction Result</H2>
      <section className={styles.Grid}>
        <section>
          <Card>
            <H5>Meta</H5>
            <p>
              <AnchorButton small={true} href={data?.meta.ingressUrl} text="View Original" rightIcon="folder-shared-open" target="_blank" />
            </p>
            <p><strong>Job Tag</strong></p>
            <p>CF Study 2021 <AnchorButton text="Show All" small={true} disabled={true} minimal={true} rightIcon="property" /></p>
            <p><strong>Tests Identified</strong></p>
            <p>
              {/* @ts-ignore */}
              {data ? [...new Set(data.result.elements.map(e => e.meta.group))].join(", ") : null}
            </p>
            <p><strong>Version ID</strong></p>
            <p>{ data?.meta.versionId}</p>
            <p><strong>Last Modified</strong></p>
            <p>{ data?.meta.lastModified}</p>
            <p><strong>Storage Location</strong></p>
            <p><Tag minimal={true} round={true}>{process.env.NEXT_PUBLIC_AWS_REGION} 🇨🇦</Tag></p>
          </Card>
        </section>

        {data ? <Data />: <Spinner />}
      </section>
    </main>
  )
}
