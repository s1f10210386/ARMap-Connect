import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { BasicHeader } from '../@components/BasicHeader/BasicHeader';
import styles from './index.module.css';

export default function AR() {
  const [user] = useAtom(userAtom);
  const containerRef = useRef<HTMLDivElement>(null); // コンテナへの参照を作成

  const text = 'text';
  useEffect(() => {
    // コンテナが空であることを確認
    if (containerRef.current && containerRef.current.children.length === 0) {
      //新しいシーンを作成
      const scene = new THREE.Scene();
      // //立方体のジオメトリ（形状）を作成
      // const geometry = new THREE.BoxGeometry();
      // //緑色のマテリアル（表面の素材）
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // //メッシュ(立方体の実態)を作成しシーンに追加
      // const cube = new THREE.Mesh(geometry, material);
      // scene.add(cube);

      const loader = new FontLoader();

      loader.load('/fonts/helvetiker_regular.typeface.json', function (fonts) {
        const textGeometry = new TextGeometry(text, {
          font: fonts,
          size: 0.5,
          height: 0.2,
          curveSegments: 12,
          // bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 2,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-0.5, 0, 0);

        scene.add(textMesh);
      });

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const aspectRatio = containerWidth / containerHeight;

      //透視投影カメラ（PerspectiveCamera）を作成し、そのアスペクト比をコンテナのサイズに基づいて設定します。
      const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
      //camera.position.z = 5 はカメラを立方体から少し離すための設定です。
      camera.position.z = 1.8;

      //レンダラーを作成
      const renderer = new THREE.WebGLRenderer();
      //サイズをコンテナのサイズに合わせます。
      renderer.setSize(containerWidth, containerHeight);

      // コンテナの現在の参照を変数に保存
      const currentContainer = containerRef.current;
      //作成したレンダラーのDOM要素をンテナに追加します。
      currentContainer.appendChild(renderer.domElement);

      // //アニメーションループの実装
      // const animate = () => {
      //   //繰り返し呼び出す
      //   requestAnimationFrame(animate);
      //   cube.rotation.x += 0.01;
      //   cube.rotation.y += 0.01;
      //   renderer.render(scene, camera);
      // };

      // animate();

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // コンポーネントのアンマウント時にレンダラーを削除するクリーンアップ関数
      return () => {
        if (currentContainer !== null) {
          currentContainer.removeChild(renderer.domElement);
        }
      };
    }
  }, []); // 依存配列は空のまま

  if (!user) return <Loading visible />;
  return (
    // <div />
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <BasicHeader user={user} />
      </div>

      <div className={styles.ar} ref={containerRef} />
    </div>
  );
}
