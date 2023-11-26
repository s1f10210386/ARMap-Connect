import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { coordinatesAtom } from 'src/atoms/user';

const ARComponent = () => {
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
  console.log('coodinates', coordinates);

  // const [posts, setPosts] = useState(null);

  const posts = [
    { latitude: 35.6895, longitude: 139.6917, content: '東京タワー' },
    { latitude: 35.779373072610795, longitude: 139.72486851576315, content: 'aaaa' },
    // { latitude: 35.779373072610795, longitude: 139.72486851576315, content: 'bdddd' },
    { latitude: 35.7780781399212, longitude: 139.72516114049802, content: 'bbbbb' },
  ];

  return (
    <div>
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
        renderer="antialias: true; alpha: true"
      >
        {/* ユーザーが５メートル以上移動した場合のみカメラの位置が更新 */}
        <a-camera gps-new-camera="gpsMinDistance: 5" />
        {/* <a-entity
          material="color: #e0aeae"
          geometry="primitive: box"
          gps-new-entity-place="latitude:  35.779373072610795; longitude:139.72486851576315"
          scale="10 10 10"
        /> */}
        {posts.map((post, index) => (
          <a-text
            key={index}
            value={post.content}
            gps-new-entity-place={`latitude: ${post.latitude}; longitude: ${post.longitude}`}
            scale="20 20 20"
            color="#606042"
            // font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
            // look-at="#camera"
            // material="emissive: #3d3d33"
          />
        ))}
        {coordinates.latitude !== null && coordinates.longitude !== null && (
          <a-text
            value={`Latitude: ${coordinates.latitude}, Longitude:${coordinates.longitude}`}
            position="0 0 -5"
            scale="10 10 10"
            color="#000000"
          />
        )}
      </a-scene>
    </div>
  );
};

export default ARComponent;
