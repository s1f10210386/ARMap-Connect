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
    const scene = new THREE.Scene();
    // コンテナのサイズを取得
    const containerWidth = containerRef.current ? containerRef.current.clientWidth : 0;
    const containerHeight = containerRef.current ? containerRef.current.clientHeight : 0;

    // カメラのアスペクト比をコンテナのサイズに合わせる
    const aspectRatio = containerWidth / containerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // コンテナにレンダラーを追加
    if (containerRef.current instanceof HTMLElement) {
      containerRef.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  if (!user) return <Loading visible />;
  return (
    <div className={styles.container}>
      <BasicHeader user={user} />

      <div className={styles.ar} ref={containerRef} />
    </div>
  );
}
