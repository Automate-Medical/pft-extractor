import Link from 'next/link'
import React, { Fragment, useState } from 'react';
import useSWR from 'swr'
import api from '../../lib/api'
import { AnchorButton, Button, ButtonGroup, Drawer, H2, HTMLTable, IButtonProps, Icon, Intent, Spinner, Tab, Tabs, Tag } from '@blueprintjs/core';

import styles from "./index.module.scss"
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { formatBytes } from '../../lib/format';

import NewJob from "./_new"

export default function Index() {
  const [filter, setFilter] = useState<string>("all")
  const [showingNewJob, setShowingNewJob] = useState<boolean>(false)

  const { data: data, error: error } = useSWR(`/extract/list?filter=${filter}`, api, { refreshInterval: 1000 })

  // @todo for database later...
  function jobTag(): string | null {
    const keys = [
      'CF Study 2021'
    ]

    return keys[0]
  }

  function Row({ pft }) {
    return (
      <tr key={pft.key}>
        <td>{ pft.stage == "finished" ? <Link href={`/extract/${pft.key}`}>{pft.key}</Link> : pft.key}</td>
        <td>{jobTag()}</td>
        <td><Tag round={true} className={styles.StageTag} minimal={true} intent={pft.stage == "finished" ? "success" : "primary"}>{ pft.stage == "finished" ? "✅" : "⌛"} {pft.stage}</Tag></td>
        <td><Tag round={true} minimal={true}>{process.env.NEXT_PUBLIC_AWS_REGION} 🇨🇦</Tag></td>
        <td>{formatBytes(pft.size)}</td>
        <td>{pft.lastModified}</td>
      </tr>
    )
  }

  function FilterButton({ group, ...props }: { group: string} & IButtonProps) {
    return (
      <Button
        onClick={() => {
          filter == group ? setFilter(null) : setFilter(group)
        }}
        active={filter == group ? true : false} {...props} />
    )
  }

  return (
    <main className={styles.Main}>
      <H2>Extract</H2>
      <Fragment>
        <section className={styles.TableFilter}>
          <ButtonGroup>
            <FilterButton text={"All PFTs"} group="all"/>
            <FilterButton text={"Started"} group="started" icon="filter"/>
            <FilterButton text={"Finished"} group="finished" icon="filter"/>
          </ButtonGroup>
          <section className={styles.TableCTA}>
            <AnchorButton icon="settings" text="Review extract rules" intent="none" disabled={true}  />
            <Button icon="import" text="Start new job" intent="primary" onClick={() => setShowingNewJob(!showingNewJob)} />
          </section>
        </section>

        <HTMLTable className={styles.Table} condensed={true} striped={true}>
          <thead>
            <tr>
              <th>UUID</th>
              <th>Job Tag</th>
              <th>Stage</th>
              <th>Location</th>
              <th>Size</th>
              <th>Last Modified <Icon icon="chevron-down" /></th>
            </tr>
          </thead>

          { data ?
            <tbody>
              { data.list.map(pft => {
                return (<Row pft={pft} key={pft.key} />)
              }) }
            </tbody>
          : <Spinner className={styles.TableLoading} />}
        </HTMLTable>
      </Fragment>
      <Drawer size={Drawer.SIZE_SMALL} isOpen={showingNewJob} icon="info-sign"
        onClose={() => setShowingNewJob(false)}
        title="Start new job">
        <NewJob />
      </Drawer>
    </main>
  )
}