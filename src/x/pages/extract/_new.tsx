import { Button, FileInput, FormGroup, H1, H2, H3, H4, H5, InputGroup, Label, Position, Spinner, TagInput, Toaster } from "@blueprintjs/core";
import React, { useState } from "react";
import { newExtracts } from "../../lib/upload";
import { AppToaster } from "./../../components/Toaster";

import styles from "./_new.module.scss"

export default function UploadFragment() {
  const [uploading, setUploading] = useState(false)
  const [filesToUpload, setFilesToUpload] = useState<FileList>()
  const [jobTag, setJobTag] = useState<string>(null)

  function handleFileChange(event: React.FormEvent<HTMLInputElement>) {
    setFilesToUpload(event.currentTarget.files)
  }

  async function upload() {
    setUploading(true)

    newExtracts(filesToUpload, jobTag)
      .then((data) => {
        AppToaster.show({ message: "PFT/CPET processing started", intent: "success"});
      }).finally(() => {
        setFilesToUpload(null)
        setUploading(false)
      })
  }

  function handleSetJobTag(e) {
    setJobTag(e.target.value)
  }

  return (
    <section className={styles.New}>
      <H1>
        New file extract
      </H1>
      <H5>Select one or more PDF files to extract PFT and CPET values from.</H5>

      <FormGroup
        helperText=""
        label="Files to extract"
        labelFor="text-input"
        labelInfo="(required)"
        >
          <FileInput
            text={filesToUpload ? `${filesToUpload[0].name} selected` : "Choose a PFT or CPET..."}
            onInputChange={(e) => handleFileChange(e)}
            fill={true} buttonText="Pick PDF" disabled={uploading}/>
        </FormGroup>

      <FormGroup
        helperText="A Job Tag is a way to identify a group of extracted PFT and CPET results. You can provide any value and search for it later."
        label="Job Tag"
        labelFor="text-input"
        labelInfo="(optional)"
        >
          <InputGroup large={true} disabled={uploading} onChange={handleSetJobTag} />
        </FormGroup>

      <Button text="Start" fill={true} large={true} disabled={uploading} loading={uploading} intent="primary" onClick={() => upload()} />
    </section>
  )

}