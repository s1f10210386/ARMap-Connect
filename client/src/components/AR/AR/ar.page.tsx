import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { coordinatesAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import styles from './ar.module.css';

// import {} from 'aframe';

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
  // console.log(coordinates);

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

  useEffect(() => {
    console.log('a');
    if (typeof AFRAME.components['click-handler'] === 'undefined') {
      AFRAME.registerComponent('click-handler', {
        init() {
          // console.log('c');
          this.el.addEventListener('click', () => {
            console.log('オブジェクトがクリックされました');
          });
        },
      });
    }

    // if (typeof AFRAME.components['click-handler'] !== undefined) return;
    // AFRAME.registerComponent('click-handler', {
    //   events: {
    //     click(evt: MouseEvent) {
    //       console.log('This entity was ckicked!');
    //     },
    //   },
    // });
  }, []);
  // const constPosts = [
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
      {coordinates.latitude !== null && coordinates.longitude !== null && (
        <div className={styles.coordinatesInfo}>
          Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </div>
      )}
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
        renderer="antialias: true; alpha: true"
      >
        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-new-camera="gpsMinDistance: 5" rotation-reader />
        {/* {constPosts.map((post, index) => (
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
            looc-at="#camera"
            align="center"
          />
        ))}

        <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" click-handler />
        <a-box foo position="-2 1 -6" rotation="0 45 0" color="#4CC3D9" click-handler />

        <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" click-handler />
        <a-light type="ambient" color="#445451" />
        <a-light type="point" intensity="2" position="2 4 4" />
      </a-scene>
    </div>
  );
};

export default ARComponent;
