import type { PostModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { coordinatesAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import styles from './ar.module.css';

const ARComponent = () => {
  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);
  const [posts, setPosts] = useState<PostModel[] | null>(null);

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

  useEffect(() => {
    if (typeof AFRAME.components['hit-box'] === 'undefined') {
      AFRAME.registerComponent('hit-box', {
        init() {
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
  }, []);

  return (
    <div>
      <Link href="/">
        <button className={styles.mapButton}>MAP</button>
      </Link>

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

        {posts?.map((post, index) => (
          <a-entity
            key={index}
            id={`post${index}`}
            gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
            position={`${index * 2} 1 -1`}
            rotation="0 0 0"
          >
            {/* 投稿内容の外枠 */}
            <a-plane color="#a4bbe5" height="1" width="1.5" position="0 0 -0.1" />

            {/* 投稿内容 */}
            <a-text
              value={post.content}
              position="0 0.2 0"
              scale="0.4 0.4 0.4"
              color="black"
              align="center"
            />

            {/* いいねオブジェクト */}
            <a-entity
              position="-0.4 -0.2 0"
              gltf-model="/models/love_heart.gltf"
              scale="0.0005 0.0005 0.0005"
            />

            <a-entity position="-0.4, -0.15 0" hit-box>
              <a-entity
                class="raycastable"
                geometry="primitive:box"
                material="color:blue; opacity: 0.5"
                scale="0.1 0.2 0.1"
                position="0 0 0"
                visible="false"
              />
            </a-entity>

            {/* いいね数 */}
            <a-text
              value={`Likes: ${post.likeCount}`}
              position="0.3 -0.2 0"
              scale="0.2 0.2 0.2"
              color="black"
            />
          </a-entity>
        ))}

        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-camera rotation-reader />

        <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: .raycastable" />
      </a-scene>
    </div>
  );
};

export default ARComponent;
