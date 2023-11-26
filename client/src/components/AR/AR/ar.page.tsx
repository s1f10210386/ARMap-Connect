const ARComponent = () => {
  return (
    <div>
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
        renderer="antialias: true; alpha: true"
      >
        <a-camera gps-new-camera="gpsMinDistance: 5" />
        <a-entity
          material="color: red"
          geometry="primitive: box"
          gps-new-entity-place="latitude: 35.77939265843798; longitude: 139.72483812291327"
          scale="10 10 10"
        />
      </a-scene>
      {/* 35.77939265843798, 139.72483812291327 */}
    </div>
  );
};

export default ARComponent;
