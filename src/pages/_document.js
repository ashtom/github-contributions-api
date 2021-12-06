import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

export default class extends Document {
  render() {
    return (
      <>
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </>
    );
  }
}
