import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import styles from './index.module.css';

const Test1 = () => {
  const [user] = useAtom(userAtom);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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
  }, []);
  if (!user) return <Loading visible />;

  return <video ref={videoRef} autoPlay className={styles.videoFull} />;
};
export default Test1;
