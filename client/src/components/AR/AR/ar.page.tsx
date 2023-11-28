import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { coordinatesAtom } from 'src/atoms/user';
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

  // const [posts, setPosts] = useState<PostModel[] | null>(null);

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

  const textRef = useRef<HTMLElement | null>(null);
  const debugRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof AFRAME.components['hit-box'] === 'undefined') {
      AFRAME.registerComponent('hit-box', {
        init() {
          // console.log('c');
          this.el.addEventListener('click', () => {
            alert('clickしました');
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
          console.log('log内容', stringToLog);
        },
      });
    }

    const textElement = textRef.current;
    console.log('textElement', textElement);
    if (textElement) {
      textElement.addEventListener('gps-entity-place-update-positon', (event: Event) => {
        const customEvent = event as CustomEvent;
        const debugElement = debugRef.current;
        console.log('debugElement', debugElement);
        if (debugElement) {
          debugElement.textContent = `${customEvent.detail.distance}m`;
          console.log(debugElement);
          textElement.setAttribute('value', `${textElement.getAttribute('distanceMsg')}left`);
        }
      });
    }
  }, []);

  return (
    <div>
      <div
        id="debug"
        ref={debugRef}
        style={{
          position: 'fixed',
          zIndex: 10000,
          backgroundColor: '#fff',
          padding: '10px',
          top: 0,
          left: 0,
          display: 'block',
        }}
      />
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

        {/* クリックしたいentityグループ */}
        <a-entity
          id="click"
          position="0 1.6 -1"
          rotation="0 0 0"
          animation="property: position; to:0.3, 1.6 -1; loop: true; dur: 2000"
          animation__2="property: rotation; to: 360 360 0; loop: true; dur: 2000"
        >
          {/* 3Dモデル */}
          <a-box color="#4CC3D9" scale="0.2 0.2 0.2" />
          {/* 当たり判定 */}
          <a-entity position="0 -0.05 0" hit-box visible="true">
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

        <a-box
          // id="haiti"
          material="color: #00fa0c"
          gps-entity-place="latitude: 35.7792549; longitude:139.7072826;"
          scale="15 15 15"
        />

        <a-text
          ref={textRef}
          id="text"
          value=""
          look-at="[gps-camera]"
          scale="30 30 30"
          position="0 55 0"
          gps-entity-place="latitude: 35.7792549; longitude:139.7072826;"
        />
        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-new-camera="gpsMinDistance: 5" gps-camera="minDistance:30; maxDistance:100">
          {/* <a-cursor /> */}
        </a-camera>
        <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: .raycastable" />
      </a-scene>
      {/* {posts?.map((post, index) => (
        <a-text
          key={index}
          id={`text${index}`}
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
    </div>
  );
};

export default ARComponent;
