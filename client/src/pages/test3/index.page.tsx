// pages/index.tsx
import dynamic from 'next/dynamic';
import Head from 'next/head';

// SSRを無効にしてARComponentを動的にインポート
const ARComponent = dynamic(() => import('../../components/AR/ARc/ARComponent'), { ssr: false });

const Home = () => {
  return (
    <>
      <Head>
        <title>AR Example</title>
        <meta charSet="utf-8" />
      </Head>

      <div>
        <ARComponent />
      </div>
    </>
  );
};

export default Home;
