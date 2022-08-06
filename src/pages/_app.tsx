import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Preview Links</title>
        <meta name="description" content="An App to quickly preview links" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Preview Links" />
        <meta property="og:description" content="An App to quickly preview links" />
        <meta property="og:image" content="https://link-preview-app.vercel.app/logo.png" />
        <meta property="og:url" content="https://link-preview-app.vercel.app/" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
