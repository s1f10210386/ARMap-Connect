import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import styles from './index.module.css';

const Test1 = () => {
  const [user] = useAtom(userAtom);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const text = 'testテストtest';

  useEffect(() => {
    // カメラフィードの取得
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('カメラへのアクセスに失敗しました: ', err);
      });

    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const containerWidth = canvasRef.current.clientWidth;
      const containerHeight = canvasRef.current.clientHeight;
      const aspectRatio = containerWidth / containerHeight;

      const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
      camera.position.z = 1.8;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(containerWidth, containerHeight);
      canvasRef.current.appendChild(renderer.domElement);

      // フォントローダーを使用してテキストメッシュを作成
      const loader = new FontLoader();
      loader.load('/fonts/Noto Sans JP Thin_Regular.json', function (fonts) {
        const textGeometry = new TextGeometry(text, {
          font: fonts,
          size: 0.2,
          height: 0.02,
          curveSegments: 10,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 0.01,
          bevelSegments: 1,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xfff8f0 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        // console.log(textMesh);

        // テキストメッシュの位置設定
        const fontSize = 0.2;
        const averageCharWidth = fontSize * 0.68;
        const textLength = text.length * averageCharWidth;
        textMesh.position.set(-textLength / 2, 0, 0);

        scene.add(textMesh);

        // アニメーションループ
        let scaleDelta = 0.005;
        const animate = () => {
          // console.log(textMesh);
          requestAnimationFrame(animate);
          textMesh.scale.z += scaleDelta;
          if (textMesh.scale.z > 1 || textMesh.scale.z < 0.1) {
            scaleDelta *= -1;
          }
          renderer.render(scene, camera);
        };
        animate();
      });
    }
  }, []);

  if (!user) return <Loading visible />;

  return (
    <div>
      <video ref={videoRef} autoPlay className={styles.videoFull} />
      <div ref={canvasRef} className={styles.canvas} />
    </div>
  );
};
export default Test1;
