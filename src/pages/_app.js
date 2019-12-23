import "normalize.css/normalize.css";
import "../styles/index.css";
import "../styles/App.css";

import Head from "next/head";

export default ({ Component, pageProps }) => (
  <>
    <Head>
      <title>GitHub Contributions</title>
      <meta
        name="description"
        content="Fetch your recent GitHub contribution counts."
      />
    </Head>
    <Component {...pageProps} />
  </>
);
