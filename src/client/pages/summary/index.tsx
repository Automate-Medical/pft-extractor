import { Button, FileInput, FormGroup, H1, H2, H3, H4, H5, HotkeysTarget2, ProgressBar, Spinner, Tag } from "@blueprintjs/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { newExtract } from "../../lib/upload";

import styles from "./index.module.scss"

const Index = () => {
  const router = useRouter()
  const [filesToUpload, setFilesToUpload] = useState<FileList>()
  const [uploading, setUploading] = useState(false)

  function handleFileChange(event: React.FormEvent<HTMLInputElement>) {
    setFilesToUpload(event.currentTarget.files)
  }

  async function upload() {
    if (!filesToUpload) return;

    setUploading(true)

    try {
      const { ID } = await newExtract(filesToUpload)
      router.push(`/summary/${ID}`)
    } catch {
      setUploading(false)
    }
  }

  const hotkeys = useMemo(() => [
    {
      combo: "cmd+enter",
      global: true,
      label: "Refresh data",
      onKeyDown: () => upload(),
    }
  ], []);

  return (
    <div className={styles.Grid}>
      <section className={styles.Main}>
        <H1>New Summary</H1>
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
            <Button large={true} disabled={!filesToUpload || uploading} loading={uploading} intent="primary" fill={false} onClick={() => upload()} onKeyDown={handleKeyDown}>
              Confirm <span className={styles.KeyHelper}>⌘</span> + <span className={styles.KeyHelper}>↵</span>
            </Button>
          )}
        </HotkeysTarget2>
        <div className={styles.SmallText}>
          <small>Looking to upload lab results in bulk? Try <Link href="/extract"><a>Extract</a></Link> instead.</small>
        </div>
      </section>
    </div>
  )
}

export default Index;