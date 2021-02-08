import { ReactElement } from "react";
import Head from "next/head";
import Nav from './Nav'

import styles from './Layout.module.scss'

const Layout = ({ children }: { children: ReactElement }) => (
  <section className={styles.Main}>
    <Head>
      <title>X | Automate Medical</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
    </Head>

    <Nav />

    { children }

    {/* <Footer /> */}
  </section>
)

export default Layout;