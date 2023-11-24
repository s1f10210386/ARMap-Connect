import { Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { coordinatesAtom, userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import type { GeolocationCoordinates } from 'src/utils/coordinates';
import { returnNull } from 'src/utils/returnNull';
import styles from './map.module.css';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
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
  const [user] = useAtom(userAtom);
  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);

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
        likes: number;
        userID: string;
      }[]
    | null
  >(null);

  const getPosts = useCallback(async () => {
    const data = await apiClient.posts.$get().catch(returnNull);
    setPosts(data);
  }, []);

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
  useEffect(() => {
    getPosts();
  }, [getPosts]);

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
              <CircleMarker
                center={[coordinates.latitude, coordinates.longitude]}
                radius={8}
                color="red"
                fillOpacity={0.1}
              />
              <Marker position={[35.779319195031604, 139.7251102426778]}>
                <Popup>
                  オフィス
                  <br />
                  posithon:[35.779319195031604, 139.7251102426778]
                </Popup>
              </Marker>

              {posts?.map((post) => (
                <Marker key={post.id} position={[post.latitude, post.longitude]}>
                  <Popup>
                    {post.postTime}
                    <br />
                    {post.content}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
      {!isPopupVisible && (
        <button onClick={handleButtonClick} className={styles.postButton}>
          POST
        </button>
      )}
      {isPopupVisible && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <TextField
              label="投稿内容"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button onClick={postPostContent} disabled={!postContent.trim()}>
                    投稿する
                  </Button>
                ),
              }}
            />

            <button onClick={handleClosePopup}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Map;
