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
          gps-new-entity-place="latitude:  35.779373072610795; longitude:139.72486851576315"
          scale="10 10 10"
        />
        {/* 35.77794586770196, 139.72510855214577 */}
      </a-scene>
    </div>
  );
};

export default ARComponent;
