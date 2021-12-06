import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

export default class extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
