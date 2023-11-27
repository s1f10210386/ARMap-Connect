import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { coordinatesAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import styles from './ar.module.css';

const ARComponent = () => {
  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);

  const router = useRouter();
  const handleMAP = async () => {
    await router.push('/');
  };
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation !== null) {
      navigator.geolocation.watchPosition((posithon) => {
        setCoordinates({
          latitude: posithon.coords.latitude,
          longitude: posithon.coords.longitude,
        });
      });
    }
  }, [setCoordinates]);
  console.log('coodinates', coordinates);
  const [posts, setPosts] = useState<
    | {
        id: string;
        userName: string;
        postTime: string;
        content: string;
        latitude: number;
        longitude: number;
        userID: string;
        likeCount: number;
      }[]
    | null
  >(null);

  const getPosts = useCallback(async () => {
    if (coordinates.latitude === null || coordinates.longitude === null) return;
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;
    const data = await apiClient.posts.$get({ query: { latitude, longitude } }).catch(returnNull);
    setPosts(data);
    console.log('getPosts');
  }, [coordinates.latitude, coordinates.longitude]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  // const [posts, setPosts] = useState(null);

  // const posts = [
  //   { latitude: 35.6895, longitude: 139.6917, content: '東京タワー' },
  //   { latitude: 35.779373072610795, longitude: 139.72486851576315, content: 'ひろき' },
  //   // { latitude: 35.779373072610795, longitude: 139.72486851576315, content: 'bdddd' },
  //   { latitude: 35.7780781399212, longitude: 139.72516114049802, content: 'bbbbb' },
  // ];

  return (
    <div>
      <button onClick={handleMAP} className={styles.mapButton}>
        MAP
      </button>
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
        renderer="antialias: true; alpha: true"
      >
        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-new-camera="gpsMinDistance: 5" />
        {/* <a-entity
          material="color: #e0aeae"
          geometry="primitive: box"
          gps-new-entity-place="latitude:  35.779373072610795; longitude:139.72486851576315"
          scale="10 10 10"
        /> */}
        {/* {posts.map((post, index) => (
          <a-text
            key={index}
            value={post.content}
            gps-new-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
            scale="10 10 10"
            position="5 5 5"
            align="center"
            look-at="#camera"
            font="/fonts/noto-sans-cjk-jp-msdf.json"
            font-image="/png/noto-sans-cjk-jp-msdf.png"
          />
        ))} */}

        {posts?.map((post, index) => (
          <a-text
            key={index}
            value={post.content}
            gps-new-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
            scale="10 10 10"
          />
        ))}
        {coordinates.latitude !== null && coordinates.longitude !== null && (
          <a-text
            value={`Latitude: ${coordinates.latitude}, Longitude:${coordinates.longitude}`}
            position="5 -2 -5"
            scale="1 1 0"
            color="#000000"
            look-at="#camera"
            align="right"
            // font="/fonts/noto-sans-cjk-jp-msdf.json"
            // font-image="/png/noto-sans-cjk-jp-msdf.png"
          />
        )}
      </a-scene>
    </div>
  );
};

export default ARComponent;
