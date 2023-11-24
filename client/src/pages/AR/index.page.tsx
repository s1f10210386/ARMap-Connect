import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import * as THREE from 'three';
import { BasicHeader } from '../@components/BasicHeader/BasicHeader';
import styles from './index.module.css';

export default function AR() {
  const [user] = useAtom(userAtom);
  const containerRef = useRef<HTMLDivElement>(null); // コンテナへの参照を作成

  useEffect(() => {
    // コンテナが空であることを確認
    if (containerRef.current && containerRef.current.children.length === 0) {
      const scene = new THREE.Scene();
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const aspectRatio = containerWidth / containerHeight;
      const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(containerWidth, containerHeight);

      // コンテナの現在の参照を変数に保存
      const currentContainer = containerRef.current;
      currentContainer.appendChild(renderer.domElement);

      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
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
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <BasicHeader user={user} />
      </div>

      <div className={styles.ar} ref={containerRef} />
    </div>
  );
}
