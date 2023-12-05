import { APP_TITLE } from 'commonConstantsWithClient';
import { GithubIcon } from 'src/components/icons/GithubIcon';
import { loginWithGitHub } from 'src/utils/login';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

const Login = () => {
  const { loadingElm, addLoading, removeLoading } = useLoading();

  // const [userName, setUserName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const loginGithub = async () => {
    addLoading();
    await loginWithGitHub();
    removeLoading();
  };

  // const loginEmail = async () => {
  //   addLoading();
  //   await authWithEmail(email, password);
  //   // console.log('aaaaa');
  //   removeLoading();
  // };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>{APP_TITLE}</div>
        <div style={{ marginTop: '16px' }} onClick={loginGithub}>
          <div className={styles.btn}>
            <GithubIcon size={18} fill="#fff" />
            <span>Login with GitHub</span>
          </div>
        </div>

        {/* <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="User Name"
        /> */}
        {/* <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div style={{ marginTop: '16px' }} onClick={loginEmail}>
          <div className={styles.btn}>
            <span>Login with Email</span>
          </div>
        </div> */}
      </div>
      {loadingElm}
    </div>
  );
};

export default Login;
