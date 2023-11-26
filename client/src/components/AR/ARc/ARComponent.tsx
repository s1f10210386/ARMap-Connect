// components/ARComponent.tsx

const ARComponent = () => {
  return (
    <a-scene embedded arjs>
      <p>a</p>
      <a-box position="5 0 -7" rotation="0 45 0" color="#4CC3D9" />
      <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" />
      <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D" />
    </a-scene>
  );
};

export default ARComponent;
