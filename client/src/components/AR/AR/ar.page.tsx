import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { coordinatesAtom } from 'src/atoms/user';
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

  // const [posts, setPosts] = useState<
  //   | {
  //       id: string;
  //       userName: string;
  //       postTime: string;
  //       content: string;
  //       latitude: number;
  //       longitude: number;
  //       userID: string;
  //       likeCount: number;
  //     }[]
  //   | null
  // >(null);

  // const getPosts = useCallback(async () => {
  //   if (coordinates.latitude === null || coordinates.longitude === null) return;
  //   const latitude = coordinates.latitude;
  //   const longitude = coordinates.longitude;
  //   const data = await apiClient.posts.$get({ query: { latitude, longitude } }).catch(returnNull);
  //   setPosts(data);
  //   console.log('getPosts');
  // }, [coordinates.latitude, coordinates.longitude]);

  // useEffect(() => {
  //   getPosts();
  // }, [getPosts]);

  useEffect(() => {
    console.log('a');
    if (typeof AFRAME.components['hit-box'] === 'undefined') {
      AFRAME.registerComponent('hit-box', {
        init() {
          // console.log('c');
          this.el.addEventListener('click', () => {
            alert('click');
            console.log('オブジェクトがクリックされました');
          });
        },
      });
    }
    if (typeof AFRAME.components['log'] === 'undefined') {
      AFRAME.registerComponent('log', {
        schema: { type: 'string' },

        init() {
          const stringToLog = this.data;
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', stringToLog);
        },
      });
    }

    if (typeof AFRAME.components['hello-world'] === 'undefined') {
      AFRAME.registerComponent('hello-world', {
        init() {
          console.log('hello, world!');
          alert('hello');
        },
      });
    }
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
        {/* <a-scene log="Hello, Scene!"> */}
        {/* <a-box log="Hello, Box!" />
        <a-entity hello-world /> */}
        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        {/* <a-camera gps-new-camera="gpsMinDistance: 5">
          <a-cursor />
        </a-camera> */}
        <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: .raycastable" />
        <a-entity position="0 1.6 -1">
          {/* 3Dモデル */}
          <a-box color="#4CC3D9" scale="0.2 0.2 0.2" />
          <a-entity position="0 -0.05 0" hit-box>
            <a-entity
              class="raycastable"
              geometry="primitive:cylinder"
              material="color:red; opacity: 0.5"
              scale="0.2 0.2 0.2"
              position="0 0.1 0"
              visible="true"
            />
            <a-entity
              class="raycastable"
              geometry="primitive:box"
              material="color:blue; opacity: 0.5"
              scale="0.2 0.25 0.1"
              position="0 0 0.1"
              visible="true"
            />
          </a-entity>
        </a-entity>
      </a-scene>

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

      {/* {posts?.map((post, index) => (
          <a-text
            key={index}
            value={post.content}
            gps-new-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
            scale="10 10 10"
            looc-at="#camera"
            align="center"
          />
        ))} */}

      {/* <a-box click-handler id="1" position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" />
        <a-box click-handler id="2" position="-2 1 -6" rotation="0 45 0" color="#4CC3D9" />
        <a-box click-handler id="3" position="-3 2 -9" rotation="0 45 0" color="#35474a" /> */}
      {/* <a-entity ball-spawner /> */}
      {/* <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" foo /> */}

      {/* <a-box camera-listener position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow />
        <a-sphere camera-listener position="0 1.25 -5" radius="1.25" color="#EF2D5E" shadow />
        <a-cylinder
          camera-listener
          position="1 0.75 -3"
          radius="0.5"
          height="1.5"
          color="#FFC65D"
          shadow
        /> */}
      {/* </a-scene> */}
    </div>
  );
};

export default ARComponent;
