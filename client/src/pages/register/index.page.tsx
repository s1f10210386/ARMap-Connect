import { APP_TITLE } from 'commonConstantsWithClient';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

const Register = () => {
  const { loadingElm, addLoading, removeLoading } = useLoading();

  // const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const createAccount = async () => {
    console.log('新規登録');
  };

  const handleChange = async () => {
    await router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>{APP_TITLE}</div>
        {/* <div style={{ marginTop: '16px' }} onClick={login}>
          <div className={styles.btn}>
            <GithubIcon size={18} fill="#fff" />
            <span>Login with GitHub</span>
          </div>
        </div> */}

        {/* <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="User Name"
        /> */}
        <input
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
        <div style={{ marginTop: '16px' }} onClick={createAccount}>
          <div className={styles.btn}>
            <span>新規登録</span>
          </div>
        </div>

        <button style={{ marginTop: '16px' }} onClick={handleChange}>
          戻る
        </button>
      </div>
      {loadingElm}
    </div>
  );
};

export default Register;
