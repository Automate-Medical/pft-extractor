import { AppProps } from 'next/app'
import Layout from '../components/Layout';
import { HotkeysProvider } from "@blueprintjs/core";

import 'normalize.css/normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <HotkeysProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </HotkeysProvider>
  )
}

export default App;