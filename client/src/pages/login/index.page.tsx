import { Box, Button, TextField, Typography } from '@mui/material';
import { APP_TITLE } from 'commonConstantsWithClient';
import type { UserId } from 'commonTypesWithClient/ids';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { GithubIcon } from 'src/components/icons/GithubIcon';
import { createAuth } from 'src/utils/firebase';
import { loginWithGitHub } from 'src/utils/login';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

const Login = () => {
  const [, setUser] = useAtom(userAtom);
  const { loadingElm, addLoading, removeLoading } = useLoading();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [loginError, setLoginError] = useState('');

  const loginGithub = async () => {
    addLoading();
    await loginWithGitHub();
    await router.push('/');
    removeLoading();
  };

  const signInWithEmail1 = async (email1: string, password: string) => {
    const auth = createAuth();
    try {
      const signInResult = await signInWithEmailAndPassword(auth, email1, password);
      const userFib = signInResult.user.uid;
      setUser((prevUser) => ({
        ...prevUser,
        id: userFib as UserId,
        email: email1,
        displayName: prevUser?.displayName,
        photoURL: prevUser?.photoURL, // 既存の photoURL を保持
      }));

      console.log('ログイン成功');
    } catch (error) {
      console.error('ログイン失敗', error);
      throw error; // エラーを再スローして、呼び出し元でハンドリングできるようにする
    }
  };

  const loginEmail = async () => {
    addLoading();

    try {
      // await authWithEmail(email, password);
      await signInWithEmail1(email, password);

      setLoginError(''); // ログインが成功したらエラーメッセージをクリア
      await router.push('/');
    } catch (error) {
      setLoginError('ログインに失敗しました'); // ログイン失敗時のメッセージを設定
    }

    removeLoading();
  };

  const handleChange = async () => {
    await router.push('/register');
  };

  const [dev, setDev] = useState(true);
  const checkdev = useCallback(() => {
    if (process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL !== undefined) {
      setDev(true);
    } else {
      setDev(false);
    }
  }, []);

  useEffect(() => {
    console.log('checkdev起動');
    checkdev();
  }, [checkdev]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {APP_TITLE}
          </Typography>
          {dev ? (
            <div style={{ marginTop: '16px' }} onClick={loginGithub}>
              <div className={styles.btn}>
                <GithubIcon size={18} fill="#fff" />
                <span>GitHubでのログインはこちら</span>
              </div>
            </div>
          ) : (
            <div>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button variant="contained" sx={{ mt: 2 }} onClick={loginEmail}>
                Login with Email
              </Button>
              {loginError && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {loginError}
                </Typography>
              )}
            </div>
          )}
        </Box>

        <button style={{ marginTop: '16px' }} onClick={handleChange}>
          新規登録
        </button>
      </div>

      {loadingElm}
    </div>
  );
};

export default Login;
