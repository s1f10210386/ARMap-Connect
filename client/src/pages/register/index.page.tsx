import { Typography } from '@mui/material';
import { APP_TITLE } from 'commonConstantsWithClient';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signUpWithEmail } from 'src/utils/login';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

const Register = () => {
  const { loadingElm, addLoading, removeLoading } = useLoading();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loginError, setLoginError] = useState('');

  const createAccount = async () => {
    addLoading();

    try {
      // await authWithEmail(email, password);
      await signUpWithEmail(email, password);
      setLoginError(''); // アカウント作成
      await router.push('/');
    } catch (error) {
      setLoginError('サインアップに失敗しました'); // ログイン失敗時のメッセージを設定
    }

    removeLoading();
  };

  const handleChange = async () => {
    await router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>{APP_TITLE}</div>
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
        {loginError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {loginError}
          </Typography>
        )}

        <button style={{ marginTop: '16px' }} onClick={handleChange}>
          戻る
        </button>
      </div>
      {loadingElm}
    </div>
  );
};

export default Register;
