import type { PostModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { coordinatesAtom, userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import styles from './ar.module.css';

const ARComponent = () => {
  const [user] = useAtom(userAtom);
  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);
  const [posts, setPosts] = useState<PostModel[] | null>(null);

  const getPosts = useCallback(async () => {
    if (coordinates.latitude === null || coordinates.longitude === null) return;
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;
    const data = await apiClient.posts.$get({ query: { latitude, longitude } }).catch(returnNull);
    setPosts(data);
    console.log('getPosts');
  }, [coordinates.latitude, coordinates.longitude]);

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

  //いいね押したら動くイイネ追加削除する関数
  const [likecount, setLikecount] = useState(0);

  const handleLike = useCallback(
    async (postId: string) => {
      if (user?.id === undefined || postId === undefined) return;

      const result = (await apiClient.posts.$post({
        body: { postId, userId: user.id },
      })) as unknown as number;

      console.log('result', result);
      setLikecount(result);
      await getPosts();

      console.log('result', result);
      console.log('likecount', likecount);
    },
    [getPosts, likecount, user?.id]
  );

  useEffect(() => {
    if (typeof AFRAME.components['hit-box'] === 'undefined') {
      AFRAME.registerComponent('hit-box', {
        schema: {
          postId: { type: 'string' },
        },
        init() {
          this.el.addEventListener('click', () => {
            // alert('clickしました');
            const postId = this.postId;
            console.log('postId', postId);
            handleLike(postId);
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
  }, [handleLike]);

  // const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  //   const R = 6371e3;
  //   const φ1 = (lat1 * Math.PI) / 180;
  //   const φ2 = (lat2 * Math.PI) / 180;
  //   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  //   const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  //   const a =
  //     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
  //     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //   return R * c; // 総距離をメートル単位で返す
  // };

  // const [visiblePosts, setVisiblePosts] = useState<PostModel[]>([]);
  // const updateVisiblePosts = useCallback(() => {
  //   const currentLat = coordinates.latitude;
  //   const currentLon = coordinates.longitude;
  //   if (currentLat === null || currentLon === null) return;

  //   const newVisiblePosts =
  //     posts?.filter((post) => {
  //       const distance = calculateDistance(currentLat, currentLon, post.latitude, post.longitude);
  //       return distance < 1000;
  //     }) ?? [];
  //   setVisiblePosts(newVisiblePosts);
  //   console.log('呼び出し');
  // }, [coordinates.latitude, coordinates.longitude, posts]);

  // useEffect(() => {
  //   // updateVisiblePosts();
  //   const id = navigator.geolocation.watchPosition(() => {
  //     updateVisiblePosts();
  //   });

  //   // クリーンアップ関数;
  //   return () => navigator.geolocation.clearWatch(id);
  // }, [updateVisiblePosts]);

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
          <a-entity key={index} id={`post${index}`} position={`${index * 2} 1 -1`} rotation="0 0 0">
            {/* 投稿内容の外枠 */}
            <a-plane color="#a4bbe5" height="1" width="1.5" position="0 0 -0.1" />

            {/* 投稿内容 */}
            <a-text
              value={post.content}
              position="0 0.2 0"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.4 0.4 0.4"
              color="black"
              align="center"
            />

            {/* いいねオブジェクト */}
            <a-entity
              position="-0.4 -0.2 0"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              gltf-model="/models/love_heart.gltf"
              scale="0.0005 0.0005 0.0005"
            />

            <a-entity position="-0.4, -0.15 0" data-post-id={post.id} hit-box>
              <a-entity
                class="raycastable"
                gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
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
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.2 0.2 0.2"
              color="black"
            />
          </a-entity>
        ))}

        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-camera="maxDistance:20" rotation-reader />

        <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: .raycastable" />
      </a-scene>
    </div>
  );
};

export default ARComponent;
