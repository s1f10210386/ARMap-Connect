// import { useAtom } from 'jotai';
// import { useEffect, useRef } from 'react';
// import { userAtom } from 'src/atoms/user';
// import { Loading } from 'src/components/Loading/Loading';
// import * as THREE from 'three';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { BasicHeader } from '../@components/BasicHeader/BasicHeader';
// import styles from './index.module.css';

// export default function AR() {
//   const [user] = useAtom(userAtom);
//   const containerRef = useRef<HTMLDivElement>(null); // コンテナへの参照を作成

//   const text = 'お疲れ様ですああああ！';
//   useEffect(() => {
//     // コンテナが空であることを確認
//     if (containerRef.current && containerRef.current.children.length === 0) {
//       //新しいシーンを作成
//       const scene = new THREE.Scene();

//       const loader = new FontLoader();
//       loader.load('/fonts/Noto Sans JP Thin_Regular.json', function (fonts) {
//         const textGeometry = new TextGeometry(text, {
//           font: fonts,
//           size: 0.2,
//           height: 0.02,
//           curveSegments: 10,
//           bevelEnabled: true,
//           bevelThickness: 0.01,
//           bevelSize: 0.01,
//           bevelSegments: 1,
//         });
//         const textMaterial = new THREE.MeshBasicMaterial({ color: 0xfff8f0 });
//         const textMesh = new THREE.Mesh(textGeometry, textMaterial);

//         const fontSize = 0.2; // フォントサイズ
//         const averageCharWidth = fontSize * 0.68; // 一文字あたりの平均幅（推定）
//         const textLength = text.length * averageCharWidth;
//         textMesh.position.set(-textLength, 0, 0);

//         scene.add(textMesh);

//         let scaleDelta = 0.005;
//         const animate = () => {
//           requestAnimationFrame(animate);
//           // Z軸のスケールを変更
//           textMesh.scale.z += scaleDelta;
//           if (textMesh.scale.z > 1 || textMesh.scale.z < 0.1) {
//             scaleDelta *= -1; // スケールの増減方向を反転
//           }
//           renderer.render(scene, camera);
//         };
//         animate();
//       });

//       const containerWidth = containerRef.current.clientWidth;
//       const containerHeight = containerRef.current.clientHeight;
//       const aspectRatio = containerWidth / containerHeight;

//       //透視投影カメラ（PerspectiveCamera）を作成し、そのアスペクト比をコンテナのサイズに基づいて設定します。
//       const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
//       //camera.position.z = 5 はカメラを立方体から少し離すための設定です。
//       camera.position.z = 1.8;

//       //レンダラーを作成
//       const renderer = new THREE.WebGLRenderer();
//       //サイズをコンテナのサイズに合わせます。
//       renderer.setSize(containerWidth, containerHeight);

//       // コンテナの現在の参照を変数に保存
//       const currentContainer = containerRef.current;
//       //作成したレンダラーのDOM要素をンテナに追加します。
//       currentContainer.appendChild(renderer.domElement);

//       // カメラフィードの取得
//       // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
//       if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         const video = document.createElement('video');
//         navigator.mediaDevices
//           .getUserMedia({ video: true })
//           .then((stream) => {
//             video.srcObject = stream;
//             video.play();
//           })
//           .catch(console.error);

//         // ビデオテクスチャの作成
//         const videoTexture = new THREE.VideoTexture(video);
//         videoTexture.minFilter = THREE.LinearFilter;
//         videoTexture.magFilter = THREE.LinearFilter;
//         videoTexture.format = THREE.RGBAFormat;

//         // シーンにビデオテクスチャを追加
//         const backgroundMesh = new THREE.Mesh(
//           new THREE.PlaneGeometry(containerWidth, containerHeight, 1, 1),
//           new THREE.MeshBasicMaterial({ map: videoTexture })
//         );

//         backgroundMesh.position.set(0, 0, -1); // カメラから少し後ろに設定
//         scene.add(backgroundMesh);
//       }

//       // コンポーネントのアンマウント時にレンダラーを削除するクリーンアップ関数
//       return () => {
//         if (currentContainer !== null) {
//           currentContainer.removeChild(renderer.domElement);
//         }
//       };
//     }
//   }, []); // 依存配列は空のまま

//   if (!user) return <Loading visible />;
//   return (
//     // <div />
//     <div className={styles.container}>
//       <div className={styles.headerContainer}>
//         <BasicHeader user={user} />
//       </div>

//       <div className={styles.ar} ref={containerRef} />
//     </div>
//   );
// }
