import { Spinner } from "@blueprintjs/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Index() {
  const router = useRouter()

  useEffect(() => {
    if (router.pathname == '/' ) router.push('/extract')
  });

  return (
    <Spinner />
  )
}

export default Index;