import { APP_TITLE } from 'commonConstantsWithClient';
import { GithubIcon } from 'src/components/icons/GithubIcon';
import { loginWithGitHub } from 'src/utils/login';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

const Login = () => {
  const { loadingElm, addLoading, removeLoading } = useLoading();

  const login = async () => {
    addLoading();
    await loginWithGitHub();
    removeLoading();
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>{APP_TITLE}</div>
        <div style={{ marginTop: '16px' }} onClick={login}>
          <div className={styles.btn}>
            <GithubIcon size={18} fill="#fff" />
            <span>Login with GitHub</span>
          </div>
        </div>
      </div>
      {loadingElm}
    </div>
  );
};

export default Login;
