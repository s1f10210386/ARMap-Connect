import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import styles from './index.module.css';

const Test1 = () => {
  const [user] = useAtom(userAtom);
  const [isCavasReady, setIsCavasReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  // const canvasRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (canvasRef.current !== null && canvasRef.current !== undefined) {
        setIsCavasReady(true);
      }
    }, 0);
  }, []);
  console.log(isCavasReady);
  const text = '!!!!!!!!!!!!';

  useEffect(() => {
    // if (!canvasRef.current) {
    //   console.log('canvasRefはまだ利用可能ではありません。');
    //   return;
    // }
    if (isCavasReady && canvasRef.current !== null) {
      console.log('canvasRef読み込まれた');
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

      const scene = new THREE.Scene();
      const containerWidth = canvasRef.current.clientWidth;
      const containerHeight = canvasRef.current.clientHeight;
      const aspectRatio = containerWidth / containerHeight;

      const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
      camera.position.z = 1.8;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(containerWidth, containerHeight);
      canvasRef.current.appendChild(renderer.domElement);

      const loader = new FontLoader();
      loader.load('/fonts/helvetiker_regular.typeface.json', function (fonts) {
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

        const fontSize = 0.2;
        const averageCharWidth = fontSize * 0.68;
        const textLength = text.length * averageCharWidth;
        textMesh.position.set(-textLength, 0, 0);

        scene.add(textMesh);

        let scaleDelta = 0.005;
        const animate = () => {
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
  }, [isCavasReady]);

  // useLayoutEffect(() => {
  //   console.log('cavasRef.current', canvasRef.current);
  //   if (canvasRef.current) {
  //     console.log('canvasRef読み込まれた');
  //     // ここでカメラフィードの取得とその他の処理を実行

  //     navigator.mediaDevices
  //       .getUserMedia({ video: true })
  //       .then((stream) => {
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //         }
  //       })
  //       .catch((err) => {
  //         console.error('カメラへのアクセスに失敗しました: ', err);
  //       });

  //     const scene = new THREE.Scene();
  //     const containerWidth = canvasRef.current.clientWidth;
  //     const containerHeight = canvasRef.current.clientHeight;
  //     const aspectRatio = containerWidth / containerHeight;

  //     const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  //     camera.position.z = 1.8;

  //     const renderer = new THREE.WebGLRenderer({ alpha: true });
  //     renderer.setSize(containerWidth, containerHeight);
  //     canvasRef.current.appendChild(renderer.domElement);

  //     const loader = new FontLoader();
  //     loader.load('/fonts/helvetiker_regular.typeface.json', function (fonts) {
  //       const textGeometry = new TextGeometry(text, {
  //         font: fonts,
  //         size: 0.2,
  //         height: 0.02,
  //         curveSegments: 10,
  //         bevelEnabled: true,
  //         bevelThickness: 0.01,
  //         bevelSize: 0.01,
  //         bevelSegments: 1,
  //       });

  //       const textMaterial = new THREE.MeshBasicMaterial({ color: 0xfff8f0 });
  //       const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  //       const fontSize = 0.2;
  //       const averageCharWidth = fontSize * 0.68;
  //       const textLength = text.length * averageCharWidth;
  //       textMesh.position.set(-textLength, 0, 0);

  //       scene.add(textMesh);

  //       let scaleDelta = 0.005;
  //       const animate = () => {
  //         requestAnimationFrame(animate);
  //         textMesh.scale.z += scaleDelta;
  //         if (textMesh.scale.z > 1 || textMesh.scale.z < 0.1) {
  //           scaleDelta *= -1;
  //         }
  //         renderer.render(scene, camera);
  //       };
  //       animate();
  //     });
  //   } else {
  //     console.log('canvasRefはまだ利用可能ではありません。');
  //   }
  // }, []);

  if (!user) return <Loading visible />;

  return (
    <div>
      <video className={styles.videoFull} ref={videoRef} autoPlay />
      <div className={styles.canvas} ref={canvasRef} />
    </div>
  );
};
export default Test1;
