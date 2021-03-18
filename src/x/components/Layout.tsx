import React, { ReactElement } from "react";
import Head from "next/head";
import Nav from './Nav'

import styles from './Layout.module.scss'
import Amplify from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react";
import AmplifyConfig from '../lib/amplify-config';

Amplify.configure(AmplifyConfig);

const Layout = ({ children }: { children: ReactElement }) => (
  <section className={styles.Main}>
    <Head>
      <title>X | Automate Medical</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
    </Head>

    <AmplifyAuthenticator>
      <AmplifySignIn hideSignUp={true} slot="sign-in"></AmplifySignIn>

      <Nav />

      { children }

      {/* <Footer /> */}
    </AmplifyAuthenticator>

  </section>
)

export default Layout;