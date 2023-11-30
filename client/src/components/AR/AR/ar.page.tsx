import type { PostModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
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

  const [posts, setPosts] = useState<PostModel[] | null>(null);

  // const getPosts = useCallback(async () => {
  //   if (coordinates.latitude === null || coordinates.longitude === null) return;
  //   const latitude = coordinates.latitude;
  //   const longitude = coordinates.longitude;
  //   const data = await apiClient.posts.$get({ query: { latitude, longitude } }).catch(returnNull);
  //   setPosts(data);
  //   console.log('getPosts');
  // }, [coordinates.latitude, coordinates.longitude]);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad && coordinates.latitude !== null && coordinates.longitude !== null) {
      const oneRendaringGetPosts = async () => {
        const latitude = coordinates.latitude as number;
        const longitude = coordinates.longitude as number;
        const data = await apiClient.posts
          .$get({ query: { latitude, longitude } })
          .catch(returnNull);
        setPosts(data);
      };

      oneRendaringGetPosts();
      setIsFirstLoad(false); // 最初のロードが完了したらフラグを更新
    }
  }, [coordinates.latitude, coordinates.longitude, isFirstLoad]);

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
        {/* <a-entity
          id="click"
          position="0 1.6 -1"
          rotation="0 0 0"
          animation="property: position; to:0.3, 1.6 -1; loop: true; dur: 2000"
          animation__2="property: rotation; to: 360 360 0; loop: true; dur: 2000"
        >
          <a-box color="#4CC3D9" scale="0.2 0.2 0.2" />

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
        </a-entity> */}

        {/* <a-text
          ref={textRef}
          id="text"
          value=""
          look-at="[gps-camera]"
          scale="30 30 30"
          position="0 55 0"
          gps-entity-place="latitude: 35.7792549; longitude:139.7072826;"
        /> */}

        {posts?.map((post, index) => (
          <a-entity
            key={index}
            id={`post${index}`}
            position={`0 ${1.6 + index * 0.5} -1`}
            rotation="0 0 0"
          >
            <a-text
              value={post.content}
              // gps-new-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.5 0.5 0.5"
              looc-at="camera"
              align="center"
              animation__fadein="property: material.opacity; from: 0; to: 1; dur: 1000"
              animation__fadeout="property: material.opacity; from: 1; to: 0; startEvents: fadeout; dur: 1000"
              animation__slide="property: position; from: 0 ${1.5 + index * 0.5} -1; to: 0 ${1.6 + index * 0.5} -1; dur: 2000; dir: alternate; repeat: indefinite"
              animation__scale="property: scale; from: 0.5 0.5 0.5; to: 1 1 1; dur: 1500"
              // animation__pos="property: position; to: 0 ${1.6 + index * 0.5 + 0.1} -1; dur: 2000; dir: alternate; repeat: indefinite"
            />
          </a-entity>
        ))}

        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-new-camera="gpsMinDistance: 5" gps-camera="minDistance:30; maxDistance:100" />

        <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: .raycastable" />
      </a-scene>
    </div>
  );
};

export default ARComponent;
