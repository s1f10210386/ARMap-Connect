import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Home = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import('../components/Map/Map/map.page'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div>
      <Map />
    </div>
  );
};

export default Home;
