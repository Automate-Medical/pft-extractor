import { Button, FileInput, FormGroup, H1, H2, H3, H4, H5, HotkeysTarget2, Spinner, Tag } from "@blueprintjs/core";
import Link from "next/link";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { newExtracts } from "../../lib/upload";

import styles from "./index.module.scss"

const Index = () => {
  const [uploading, setUploading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<FileList>()
  const [stage, setStage] = useState<string>();
  const [progress, setProgress] = useState(0.1);

  function handleFileChange(event: React.FormEvent<HTMLInputElement>) {
    setFilesToUpload(event.currentTarget.files)
  }

  async function upload() {
    console.log("upload fired")
    if (!filesToUpload || uploading) return;

    setUploading(true)
    setStage("Uploading")

    newExtracts(filesToUpload)
      .then((response) => { console.log(response[0]) })
      .finally(() => {
        console.log(arguments)
        // setUploading(false)
      })
  }

  const hotkeys = useMemo(() => [
    {
      combo: "cmd+enter",
      global: true,
      label: "Refresh data",
      onKeyDown: () => upload(),
    }
], []);

  if (stage) {
    return (
      <section className={styles.Main}>
        <Spinner size={120} value={progress} />
        <div className={styles.Stage}>
          <Tag minimal={true} large={true}>{stage}</Tag>
        </div>
      </section>
    )
  } else {
    return (
      <section className={styles.Main}>
        <H1>New Case</H1>
        <H2>PDF Upload Path</H2>
        <H4>Extract and summarize a PFT from a file.</H4>
        <FormGroup
          helperText=""
          label={!!filesToUpload ? null : "PFT to interpret"}
          labelFor="text-input"
          labelInfo="(required)"
          className={styles.Input}
          >
            {!!filesToUpload ?
              (
                <Fragment>
                  <H5>You selected {filesToUpload[0].name}. Confirm to proceed.</H5>
                  <a onClick={() => setFilesToUpload(null)}><strong>Or Switch.</strong></a>

                </Fragment>
              )
            :
              (
                <FileInput
                  text={filesToUpload ? `${filesToUpload[0].name} selected` : "Choose a PDF or a screenshot..."}
                  onInputChange={(e) => handleFileChange(e)}
                  fill={true} buttonText="Choose" large={true}
                  />
              )
            }
        </FormGroup>

        <HotkeysTarget2 hotkeys={hotkeys}>
          {({ handleKeyDown, handleKeyUp }) => (
            <Button large={true} disabled={!filesToUpload} intent="primary" fill={false} onClick={() => upload()} onKeyDown={handleKeyDown}>
              Confirm <span className={styles.KeyHelper}>⌘</span> + <span className={styles.KeyHelper}>↵</span>
            </Button>
          )}
        </HotkeysTarget2>
        <div className={styles.SmallText}>
          <small>Looking to upload lab results in bulk? Try <Link href="/extract"><a>Extract</a></Link> instead.</small>
        </div>
      </section>
    )
  }
}

export default Index;