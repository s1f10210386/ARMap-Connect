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

  const [isliked, setIsliked] = useState(false);
  window.handleLike = async (postId: string) => {
    if (user?.id === undefined || postId === undefined) return;

    const result = (await apiClient.posts.$post({
      body: { postId, userId: user.id },
    })) as unknown as number;

    console.log('result', result);
    setLikecount(result);
    setIsliked(!isliked);
    await getPosts();

    console.log('result', result);
    console.log('likecount', likecount);
  };

  window.deletePostContent = async (postID: string) => {
    console.log('postID', postID);
    await apiClient.myPost.$delete({ query: { postID } }).catch(returnNull);

    await getPosts();
  };

  useEffect(() => {
    if (typeof AFRAME.components['likes'] === 'undefined') {
      AFRAME.registerComponent('likes', {
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

    if (typeof AFRAME.components['delete'] === 'undefined') {
      AFRAME.registerComponent('delete', {
        schema: {
          postId: { type: 'string' },
        },
        init() {
          this.el.addEventListener('click', () => {
            // alert('clickしました');
            const postId = this.data.postId;
            // console.log('postID', postId);
            if (confirm('削除しますか？')) window.deletePostContent(postId);
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
    const maxLength = 17;
    let formattedContent = '';
    for (let i = 0; i < content.length; i += maxLength) {
      const line = content.substring(i, i + maxLength);
      formattedContent += line + (i + maxLength < content.length ? '\n' : '');
    }
    return formattedContent;
  };

  const radius = 5;
  const numPosts = posts?.length;
  // X座標を計算する関数
  const xValue = (index: number) => {
    if (numPosts === undefined) return;
    const angle = (index / numPosts) * Math.PI * 2;
    return radius * Math.cos(angle);
  };

  // Y座標を計算する関数（例では一定の高さを返します）
  const yValue = () => {
    if (numPosts === undefined) return;
    return 0; // 高さは1に固定
  };

  // Z座標を計算する関数
  const zValue = (index: number) => {
    if (numPosts === undefined) return;
    const angle = (index / numPosts) * Math.PI * 2;
    return radius * Math.sin(angle);
  };

  return (
    <div>
      <Link href="/">
        <button className={styles.mapButton}>MAPに戻る</button>
      </Link>

      {/* {coordinates.latitude !== null && coordinates.longitude !== null && (
        <div className={styles.coordinatesInfo}>
          Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </div>
      )} */}
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
        renderer="antialias: true; alpha: true"
      >
        <a-assets>
          <img id="delete" src="/icons/delete.png" />
          <img id="heart" src="/icons/likes.png" />
        </a-assets>
        {posts?.map((post, index) => (
          <a-entity
            key={index}
            id={`post${index}`}
            position={`${xValue(index)} ${yValue()} ${zValue(index)}`}
            rotation={`0 0 0`}
            look-at="[camera]"
            scale="3 3 3"
            animation="property: scale; to: 2.8 2.8 2.8; dir: alternate; dur: 2000; loop: true"
          >
            {/* 投稿内容の外枠 */}
            {post.userID === user?.id ? (
              <a-box color="#c2c7ee" height="1" width="1.5" depth="0.1" position="0 0 -0.1" />
            ) : (
              // <a-plane color="#f6a985" height="1" width="1.5" position="0 0 -0.1" />
              <a-box
                color="#f6a985"
                height="1"
                width="1.5"
                depth="0.1"
                position="0 0 -0.1"
                animation="property: position; to: 0 0.1 -0.1; dir: alternate; dur: 2000; loop: true"
              />
            )}

            <a-plane color="#fffbfb" height="0.9" width="1.4" position="0 0 0" align="center" />

            {/* 投稿内容 */}

            <a-text
              value={formatContent(post.content)}
              font="/fonts/mplus-msdf.json"
              font-image="/png/mplus-msdf.png"
              position="-0.65 0.2 0.001"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.4 0.4 0.4"
              color="#000000"
              // align="center"
              negate="false"
            />

            {/* いいねオブジェクト */}
            {/* <a-entity
              position="-0.4 -0.3 0"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              gltf-model="/models/love_heart.gltf"
              scale="0.0008 0.0007 0.0005"
            /> */}
            {isliked ? (
              <a-plane
                material="src : #heart ;transparent: true; color:red;"
                position="-0.4 -0.3 0.09"
                scale="0.2 0.2 0.2"
                gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              />
            ) : (
              <a-plane
                material="src : #heart ;transparent: true; color:white;"
                position="-0.4 -0.3 0.09"
                scale="0.2 0.2 0.2"
                gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              />
            )}

            <a-entity position="-0.4, -0.3 0.1" likes={`postId: ${post.id}`}>
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
              position="-0.5 -0.2 0.1"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.2 0.2 0.2"
              color="black"
            />
            {/*投稿時間 */}
            <a-text
              value={`${formatTime(post.postTime)}`}
              position="0.01 -0.4 0"
              font="/fonts/mplus-msdf.json"
              font-image="/png/mplus-msdf.png"
              gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
              scale="0.25 0.25 0.25"
              color="#413f3f"
              negate="false"
            />

            {/*削除機能 */}
            {user?.id === post.userID && (
              <>
                <a-plane
                  material="src : #delete ;transparent: true;"
                  position="0.3 -0.25 0.1"
                  scale="0.1 0.1 0.1"
                  gps-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
                />
                <a-entity position="0.3, -0.25 0.1" delete={`postId: ${post.id}`}>
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
              </>
            )}
          </a-entity>
        ))}

        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-camera rotation-reader />
        <a-light type="ambient" color="#FFFFFF" />

        <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: .raycastable" />
      </a-scene>
    </div>
  );
};

export default ARComponent;
