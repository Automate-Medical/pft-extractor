import { AnchorButton, Callout, Card, H1, H2, H4, ProgressBar, Spinner, Tag } from "@blueprintjs/core";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import api from "../../lib/api";
import { Extract, ExtractStage } from "../../../@types/extract"
import Spirometry from "../../components/Spirometry"

import styles from "./[id].module.scss"
import DiffusingCapacity from "../../components/DiffusingCapacity";

export default () => {
  const router = useRouter()
  const { id } = router.query

  const [stage, setStage] = useState<string>();
  const [progress, setProgress] = useState(0.1);

  const { data }: SWRResponse<{ extract: Extract }, string> = useSWR(id ? `/extract/${id}` : null, api, {
    refreshInterval: 1000
  })

  useEffect(() => {
    if (!data) return;

    switch (data.extract.Stage) {
      case "NEW":
        setStage("📡 Receiving PFT")
        setProgress(0.1)
        break;
      case "STARTED":
        setProgress(0.3)
        setStage("🔎 Searching for data (20 seconds)")
        break;
      case "ANALYZED":
        setStage("📊 Analyzing results (5 seconds)")
        setProgress(0.8)
        break;
      case "IDENTIFIED":
        setStage("Done")
        setProgress(1)
        break;
      case "ERROR":
        setStage("An error occurred")
        setProgress(1)
        break;
    }
  }, [data])

  if (data) {
    switch (data.extract.Stage) {
      case "IDENTIFIED":
        return (
          <section className={styles.Main}>
            <H1>Summary <Tag>{ data.extract.Result.elements.length } elements identified</Tag></H1>
            <Callout icon={null} intent="primary" title="A normal study">No evidence of airflow obstruction on spirometry. Lung volume testing was within normal limits with no evidence of restriction or gas trapping. Diffusion capacity is normal. Normal study.</Callout>
            <Card>
              <Spirometry pft={data.extract.Result} />
            </Card>
            <Card>
              <DiffusingCapacity pft={data.extract.Result} />
            </Card>
          </section>
        )
      case "ERROR":
        return (
          <Fragment>
            <H4 className={styles.Stage}>{stage}</H4>
            <ProgressBar value={progress} intent="primary" />
          </Fragment>
        )
      default:
        return (
          <section className={styles.NotFinished}>
            <H4 className={styles.Stage}>{stage}</H4>
            <ProgressBar value={progress} intent="primary" />
          </section>
        )
    }
  } else {
    return <Spinner className={styles.Loading} />;
  }
}