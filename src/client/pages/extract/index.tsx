import Link from 'next/link'
import React, { Fragment, useState } from 'react';
import useSWR, { SWRResponse } from 'swr'
import api from '../../lib/api'
import { AnchorButton, Button, ButtonGroup, Drawer, H1, HTMLTable, IButtonProps, Icon, NonIdealState, Spinner, Tag } from '@blueprintjs/core';

import styles from "./index.module.scss"
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import NewJob from "./_new"

export default function Index() {
  const [filter, setFilter] = useState<string>("ALL")
  const [showingNewJob, setShowingNewJob] = useState<boolean>(false)

  const { data, error }: SWRResponse<{ list: any[]}, string> = useSWR(`/extract?filter=${filter}`, api, { refreshInterval: 1000 })

  console.log(data, error)

  function FilterButton({ group, ...props }: { group: string} & IButtonProps) {
    return (
      <Button
        onClick={() => {
          filter == group ? setFilter(null) : setFilter(group)
        }}
        active={filter == group ? true : false} {...props} />
    )
  }

  function Row({ pft }) {
    return (
      <tr key={pft.key}>
        <td>{ pft.stage == "IDENTIFIED" ? <Link href={`/extract/${pft.key}`}>{pft.key}</Link> : pft.key}</td>
        <td>{pft.jobTag}</td>
        <td><Tag round={true} className={styles.StageTag} minimal={true} intent={pft.stage == "IDENTIFIED" ? "success" : "primary"}>{ pft.stage == "IDENTIFIED" ? "✅" : "⌛"} {pft.stage}</Tag></td>
        <td><Tag round={true} minimal={true}>{process.env.NEXT_PUBLIC_AWS_REGION} 🇨🇦</Tag></td>
        <td>{pft.lastModified}</td>
      </tr>
    )
  }

  const count = data?.list?.length;

  function Results() {
    if (data && count > 0) {

      const rows = data?.list?.sort((a, b) => {
        if (a.lastModified < b.lastModified) {
          return 1
        } else if (a.lastModified > b.lastModified) {
          return -1
        } else {
          return 0
        }
      }).map((row) => {
        return (<Row pft={row} key={row.key} />)
      })

      return (
        <HTMLTable className={styles.Table} condensed={true} striped={true}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Job Tag</th>
              <th>Stage</th>
              <th>Location</th>
              <th>Last Modified <Icon icon="chevron-down" /></th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </HTMLTable>
      )
    } else if (error) {
      console.log(error)
      return (
        <NonIdealState
          icon="error"
          title="Error"
          description="No Extracts match this search" />
      )
    } else if (data) {
      return (
        <NonIdealState
          icon="search"
          title="No results"
          description="No Extracts match this search" />
      )
    } else {
      return <Spinner className={styles.TableLoadingSpinner} />
    }
  }

  return (
    <main className={styles.Main}>
      <H1>Extract <small>Showing { count } results</small></H1>
      <Fragment>
        <section className={styles.TableFilter}>
          <ButtonGroup>
            <FilterButton text={"All PFTs"} group="ALL"/>
            <FilterButton text={"Started"} group="STARTED" icon="filter"/>
            <FilterButton text={"Identified"} group="IDENTIFIED" icon="filter"/>
          </ButtonGroup>
          <section className={styles.TableCTA}>
            <AnchorButton icon="settings" text="Review extract rules" intent="none" disabled={true}  />
            <Button icon="import" text="Start new job" intent="primary" onClick={() => setShowingNewJob(!showingNewJob)} />
          </section>
        </section>
        <Results />
      </Fragment>
      <Drawer size={Drawer.SIZE_SMALL} isOpen={showingNewJob} icon="info-sign"
        onClose={() => setShowingNewJob(false)}
        title="Start new job">
        <NewJob />
      </Drawer>
    </main>
  )
}