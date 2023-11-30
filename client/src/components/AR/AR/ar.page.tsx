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
  }, []);

  // const handleReload = () => {
  //   window.location.href = '/'; // ページのリロード
  // };

  interface PostWithDistane extends PostModel {
    distance: number;
  }
  const [postWithDistance, setPostsWithDistance] = useState<PostWithDistane[]>([]);
  const updateDistance = (index: number, distance: number) => {
    setPostsWithDistance((currentPosts) => {
      const newPosts = [...currentPosts];
      newPosts[index] = { ...newPosts[index], distance };
      console.log('newPosts', newPosts);
      return newPosts;
    });
  };
  // console.log('postswithdistance', postWithDistance);

  useEffect(() => {
    posts?.forEach((post, index) => {
      const entity = document.querySelector(`#posts${index}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      entity?.addEventListener('gps-entity-place-update-distance', (event: any) => {
        updateDistance(index, event.detail.distance);
      });
    });
  }, [posts]);
  useEffect(() => {
    if (posts) {
      setPostsWithDistance(posts.map((post) => ({ ...post, distance: 0 })));
    }
  }, [posts]);
  return (
    <div>
      {/* <button onClick={handleReload} className={styles.mapButton}>
        MAP
      </button> */}
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
            position={`0 ${1.6 + index * 0.5} -1`}
            rotation="0 0 0"
          >
            <a-text
              value={post.content}
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.5 0.5 0.5"
              looc-at="camera"
              color="black"
              // align="center"
              // animation__fadein="property: material.opacity; from: 0; to: 1; dur: 1000"
              // animation__slide="property: position; from: 0 ${1.5 + index * 0.5} -1; to: 0 ${1.6 + index * 0.5} -1; dur: 2000; dir: alternate; repeat: indefinite"
              // animation__scale="property: scale; from: 0.5 0.5 0.5; to: 1 1 1; dur: 1500"
            />
            <a-entity
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              position={`0.5 0 0`}
              scale="0.0005 0.0005 0.0005"
              // scale="1 1 1"
              gltf-model="/models/love_heart.gltf"
            />
            <a-text
              value={`Likes: ${post.likeCount}`}
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              position={`1 0 0`}
              scale="0.2 0.2 0.2"
              // scale="10 10 10"
              look-at="[gps-camra]"
              color="black"
            />
          </a-entity>
        ))}

        {postWithDistance.map((post, index) => (
          <a-entity key={index} id={`posts${index}`}>
            <a-text
              value={`Distance: ${post.distance.toFixed(2)} m`}
              scale="1 1 1"
              position="0 1.6 -1"
              look-at="[gps-camera]"
              align="center"
            />
          </a-entity>
        ))}

        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-new-camera="gpsMinDistance: 5" />

        <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: .raycastable" />
      </a-scene>
    </div>
  );
};

export default ARComponent;
