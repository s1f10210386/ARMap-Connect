import ThreeDRotationTwoToneIcon from '@mui/icons-material/ThreeDRotationTwoTone';
import type { UserModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { isMapViewAtomAtom } from 'src/atoms/user';
import { HumanIcon } from 'src/components/icons/HumanIcon';
import { logout } from 'src/utils/login';
import styles from './BasicHeader.module.css';

export const BasicHeader = ({ user }: { user: UserModel }) => {
  const onLogout = async () => {
    if (confirm('ログアウトしますか？')) await logout();
  };

  const router = useRouter();
  const [isMapView, setIsMapView] = useAtom(isMapViewAtomAtom);

  const handleChenge = async () => {
    if (isMapView) {
      await router.push('/');
    } else {
      await router.push('/AR');
    }
    setIsMapView(!isMapView);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.userBtn} onClick={onLogout}>
          {user.photoURL !== undefined ? (
            <img
              className={styles.userIcon}
              src={user.photoURL}
              height={24}
              alt={user.displayName}
              style={{ paddingRight: 10 }}
            />
          ) : (
            <HumanIcon size={30} />
          )}
          <span className={styles.userName}>{user.displayName}</span>
        </div>

        <h3>ARMapSNS</h3>

        <ThreeDRotationTwoToneIcon onClick={handleChenge} fontSize="large" />
      </div>
    </div>
  );
};
