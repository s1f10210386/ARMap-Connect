/* eslint-disable complexity */
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SendIcon from '@mui/icons-material/Send';
import { Button, TextField } from '@mui/material';
import Fab from '@mui/material/Fab';
import { useAtom } from 'jotai';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import myIconURL from 'public/images/me.png';
import otherIconURL from 'public/images/other.png';
import pingIconURL from 'public/images/pingu.png';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { coordinatesAtom, userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import type { GeolocationCoordinates } from 'src/utils/coordinates';
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
  const [user] = useAtom(userAtom);
  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);

  // console.log(user?.id);
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
    console.log('getPosts');
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

  //いいね押したら動くイイネ追加削除する関数
  const [likecount, setLikecount] = useState(0);

  const handleLike = async (postId: string) => {
    if (user?.id === undefined || postId === undefined) return;

    const result = (await apiClient.posts.$post({
      body: { postId, userId: user.id },
    })) as unknown as number;
    setLikecount(result);
    await getPosts();

    console.log('result', result);
    console.log('likecount', likecount);
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

  if (!user) return <Loading visible />;

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
                      <div style={{ fontSize: '18px', marginBottom: 'auto', overflow: 'auto' }}>
                        {post.content}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'end',
                        }}
                      >
                        <Fab
                          size="small"
                          color="secondary"
                          aria-label="like"
                          onClick={() => handleLike(post.id)}
                          style={{ flexGrow: 0 }}
                        >
                          <FavoriteIcon />
                        </Fab>
                        <span>{post.likeCount}いいね</span>
                        <div style={{ fontSize: '10px' }}>{formatTime(post.postTime)}</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {!isPopupVisible && (
        <div className={styles.nearInfo}>
          近くに<span className={styles.infoNumber}>{posts ? posts.length : 0}</span>
          件の投稿があります
        </div>
      )}
      {!isPopupVisible && (
        <Fab
          className={styles.postButton}
          onClick={handleButtonClick}
          style={{
            backgroundColor: '#90caf9',
            width: '80px',
            height: '80px',
            position: 'absolute',
            top: '90vh',
            left: '50vw',
            transform: 'translate(-50%, -50%)',
          }}
          color="primary"
        >
          <PostAddIcon sx={{ fontSize: 50, color: 'black' }} />
        </Fab>
      )}
      {isPopupVisible && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <div
              style={{
                padding: '10px 0',
                textAlign: 'left',
                marginBottom: '20px',
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
