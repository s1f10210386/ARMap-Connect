// pages/_app.js
import type { AppProps } from 'next/app';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src="https://aframe.io/releases/0.9.2/aframe.min.js" strategy="afterInteractive" />
      <Script
        src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.5.0/aframe/build/aframe-ar.js"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
