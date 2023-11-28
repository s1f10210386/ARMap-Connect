import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { gaPageview } from 'src/utils/gtag';
import '../styles/globals.css';
import { AuthLoader } from './@components/AuthLoader';

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('../components/SafeHydrate'), { ssr: false });
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) gaPageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <script src="https://aframe.io/releases/1.3.0/aframe.min.js" />
      <script
        type="text/javascript"
        src="https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex-location-only.js"
      />
      <script
        type="text/javascript"
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
      />
      <SafeHydrate>
        <Component {...pageProps} />
      </SafeHydrate>
      <AuthLoader />
    </>
  );
}

export default MyApp;
