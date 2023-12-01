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

  window.handleLike = async (postId: string) => {
    if (user?.id === undefined || postId === undefined) return;

    const result = (await apiClient.posts.$post({
      body: { postId, userId: user.id },
    })) as unknown as number;

    console.log('result', result);
    setLikecount(result);
    await getPosts();

    console.log('result', result);
    console.log('likecount', likecount);
  };
  useEffect(() => {
    if (typeof AFRAME.components['hit-box'] === 'undefined') {
      AFRAME.registerComponent('hit-box', {
        schema: {
          postId: { type: 'string' },
        },
        init() {
          this.el.addEventListener('click', () => {
            // alert('clickしました');
            const postId = this.data.postId;
            console.log('postID', postId);
            window.handleLike(postId);
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

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('ja-JP', options).format(date);
  };

  const formatContent = (content: string): string => {
    const maxLength = 12;
    let formattedContent = '';
    for (let i = 0; i < content.length; i += maxLength) {
      const line = content.substring(i, i + maxLength);
      formattedContent += line + (i + maxLength < content.length ? '\n' : '');
    }
    return formattedContent;
  };

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
        {posts?.map((post, index) => (
          <a-entity
            key={index}
            id={`post${index}`}
            position={`${index * 2} 1 -1`}
            rotation="-10 0 0"
          >
            {/* 投稿内容の外枠 */}
            {post.userID === user?.id ? (
              <a-box color="#c2c7ee" height="1" width="1.5" depth="0.1" position="0 0 -0.1" />
            ) : (
              // <a-plane color="#f6a985" height="1" width="1.5" position="0 0 -0.1" />
              <a-box color="#f6a985" height="1" width="1.5" depth="0.1" position="0 0 -0.1" />
            )}

            <a-plane color="#fffbfb" height="0.5" width="1" position="0 0.2 0" align="center" />

            {/* 投稿内容 */}

            <a-text
              value={formatContent(post.content)}
              font="/fonts/mplus-msdf.json"
              font-image="/png/mplus-msdf.png"
              position="0 0.2 0.001"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.4 0.4 0.4"
              color="#000000"
              align="center"
              negate="false"
            />

            {/* いいねオブジェクト */}
            <a-entity
              position="-0.4 -0.3 0"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              gltf-model="/models/love_heart.gltf"
              // gltf-model="/models/AnyConv.com__love_heart (1).gltf"
              scale="0.0008 0.0007 0.0005"
            />

            <a-entity position="-0.4, -0.225 0" hit-box={`postId: ${post.id}`}>
              <a-entity
                class="raycastable"
                gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
                geometry="primitive:box"
                material="color:blue; opacity: 0.5"
                scale="0.2 0.2 0.1"
                position="0 0 0"
                visible="false"
              />
            </a-entity>

            {/* いいね数 */}
            <a-text
              value={`Likes: ${post.likeCount}`}
              position="-0.48 -0.1 0"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.2 0.2 0.2"
              color="black"
            />
            <a-text
              value={`${formatTime(post.postTime)}`}
              position="0.1 -0.3 0"
              font="/fonts/mplus-msdf.json"
              font-image="/png/mplus-msdf.png"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.15 0.15 0.15"
              color="#000000"
              negate="false"
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
