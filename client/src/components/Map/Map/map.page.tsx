/* eslint-disable complexity */
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import CampaignIcon from '@mui/icons-material/Campaign';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Button, TextField } from '@mui/material';
import Fab from '@mui/material/Fab';
import { useAtom } from 'jotai';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/router';
import myIconURL from 'public/images/me.png';
import otherIconURL from 'public/images/other.png';
import pingIconURL from 'public/images/pinn.png';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { coordinatesAtom, userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import { formatTime } from 'src/utils/format';
import type { GeolocationCoordinates } from 'src/utils/interface';
import { returnNull } from 'src/utils/returnNull';
import styles from './map.module.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: myIconURL.src,
  iconSize: [48, 48],
});
const myIcon = L.icon({
  iconUrl: myIconURL.src,
  iconSize: [48, 48],
});
const otherIcon = L.icon({
  iconUrl: otherIconURL.src,
  iconSize: [48, 48],
});
const pingIcon = L.icon({
  iconUrl: pingIconURL.src,
  iconSize: [48, 48],
});

interface LocationMarkerProps {
  coordinates: GeolocationCoordinates;
}

const LocationMarker: FC<LocationMarkerProps> = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates.latitude !== null && coordinates.longitude !== null) {
      map.setView([coordinates.latitude, coordinates.longitude], map.getZoom());
    }
  }, [coordinates, map]);

  return null; // このコンポーネントはビジュアルをレンダリングしません。
};
const Map: FC = () => {
  // console.log('my', myIconURL);
  const [user, setUser] = useAtom(userAtom);
  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);

  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser !== null) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } else {
      router.push('/login');
    }
  }, [setUser, router]);

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
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };
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

  //24時間以内かつ半径10km以内のものをget! useEffectで呼び出される、、
  const getPosts = useCallback(async () => {
    if (coordinates.latitude === null || coordinates.longitude === null) return;
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;
    const data = await apiClient.posts.$get({ query: { latitude, longitude } }).catch(returnNull);
    setPosts(data);
    // console.log('getPosts');
  }, [coordinates.latitude, coordinates.longitude]);

  const [postContent, setPostContent] = useState('');
  const postPostContent = async () => {
    if (user?.id === undefined || postContent === '') return;
    if (coordinates.latitude === null || coordinates.longitude === null) return;

    // const postUserName = user.displayName;
    const postUserName = 'aaa';
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;
    await apiClient.myPost.$post({
      body: { username: postUserName, content: postContent, latitude, longitude, userID: user.id },
    });
    setPostContent('');
    handleClosePopup();
    getPosts();
  };

  //自分の投稿をdeleteする関数
  const deletePostContent = async (postID: string) => {
    await apiClient.likes.$delete({ body: { postId: postID } }).catch(returnNull);
    await apiClient.myPost.$delete({ query: { postID } }).catch(returnNull);
    await getPosts();
  };

  //いいね押したら動くイイネ追加削除する関数
  // const [likecount, setLikecount] = useState(0);

  const handleLike = async (postId: string) => {
    if (user?.id === undefined || postId === undefined) return;

    const result = await apiClient.likes.$patch({
      body: { postId, userId: user.id },
    });
    // setLikecount(result);
    // await getPosts();

    // console.log('result', result);
    // console.log('likeCount', likecount);
    setPosts((prevPosts) => {
      if (!prevPosts) return prevPosts;

      return prevPosts.map((post) => {
        if (post.id === postId) {
          // 更新されたlikeCountを持つ投稿を返す
          return { ...post, likeCount: result };
        } else {
          // 他の投稿はそのまま返す
          return post;
        }
      });
    });
  };

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

  if (!user) {
    return (
      <div>
        <Loading visible />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container}>
        <BasicHeader user={user} />
        {coordinates.latitude !== null && coordinates.longitude !== null && (
          <div className={`${styles.mapWrapper} ${isPopupVisible ? styles.blurred : ``}`}>
            <MapContainer
              center={[coordinates.latitude, coordinates.longitude]}
              zoom={17}
              scrollWheelZoom={false}
              style={{ height: '93vh', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker coordinates={coordinates} />

              <Marker position={[coordinates.latitude, coordinates.longitude]} icon={pingIcon} />

              {/*ユーザーIDと"誰が投稿したか"という情報のpostのuserIDが一致するなら本人*/}
              {posts?.map((post) => (
                <Marker
                  key={post.id}
                  icon={user.id === post.userID ? myIcon : otherIcon}
                  position={[post.latitude, post.longitude]}
                >
                  <Popup>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '200px',
                        width: '300px',
                      }}
                    >
                      {/* メッセージエリア */}
                      <div style={{ fontSize: '18px', overflow: 'auto' }}>{post.content}</div>

                      {/* いいねボタン*/}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '30px',
                          left: '20px',
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<FavoriteIcon style={{ color: '#FF6961' }} />}
                          onClick={() => handleLike(post.id)}
                          sx={{ border: '1px solid #FF6961' }}
                        >
                          <span className="likeCount">{post.likeCount}</span>
                        </Button>
                      </div>

                      <div
                        style={{
                          position: 'absolute', // 絶対位置を設定
                          bottom: '10px', // 下から10pxの位置に配置
                          width: '100%', // 幅を親要素に合わせる
                          display: 'flex',
                          justifyContent: 'space-between',

                          paddingRight: '10px', // 右の余白
                        }}
                      >
                        {/* 投稿日とDELETEボタン */}
                        <div style={{ fontSize: '10px' }}>
                          {formatTime(post.postTime)}
                          {user.id === post.userID ? (
                            <DeleteIcon
                              onClick={() => {
                                if (confirm('削除しますか？')) {
                                  deletePostContent(post.id);
                                }
                              }}
                              sx={{ alignSelf: 'flex-end', marginLeft: '130px' }}
                            />
                          ) : (
                            <div />
                          )}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* {!isPopupVisible && (
        <div className={styles.nearInfo}>
          近くに<span className={styles.infoNumber}>{posts ? posts.length : 0}</span>
          件の投稿があります
        </div>
      )} */}

      {/*POSTボタン*/}
      {!isPopupVisible && (
        <Fab
          className={styles.postButton}
          onClick={handleButtonClick}
          style={{
            backgroundColor: '#90caf9',
            width: '80px',
            height: '80px',
            position: 'absolute',
            top: '80vh',
            left: '50vw',
            transform: 'translate(-50%, -50%)',
            // border: '2px solid #1DA1F2',
          }}
        >
          <CampaignIcon sx={{ fontSize: 50, color: 'black' }} />
        </Fab>
      )}

      {/* 投稿コンポーネント */}
      {isPopupVisible && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <div
              style={{
                padding: '10px 0',
                textAlign: 'left',
                marginBottom: '40px',
                fontSize: '14px',
                color: 'black',
              }}
            >
              今、あなたの周りで何が起こってる？
            </div>
            <TextField
              label="なにがおきてる？"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              multiline
              rows={5}
              variant="outlined"
              style={{ marginBottom: 'auto' }}
              InputProps={{
                sx: {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#90caf9',
                  },
                },
              }}
            />
            <div
              style={{
                alignSelf: 'flex-end',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Button
                variant="contained"
                startIcon={<KeyboardReturnIcon />}
                onClick={handleClosePopup}
                sx={{ backgroundColor: '#FFCC80' }}
              >
                戻る
              </Button>
              <Button
                variant="contained"
                onClick={postPostContent}
                disabled={!postContent.trim()}
                sx={{ backgroundColor: '#90caf9' }}
                endIcon={<SendIcon />}
              >
                POST
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
