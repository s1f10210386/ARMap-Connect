import { Box, Button, TextField, Typography } from '@mui/material';
import type { UserId } from 'commonTypesWithClient/ids';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { createAuth } from 'src/utils/firebase';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

const Login = () => {
  const [, setUser] = useAtom(userAtom);
  const { loadingElm, addLoading, removeLoading } = useLoading();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();

  const [loginError, setLoginError] = useState('');

  // const loginWithGitHub1 = async () => {
  //   try {
  //     const ghProvider = new GithubAuthProvider();
  //     ghProvider.addScope('read:user');
  //     const signInResult = await signInWithPopup(createAuth(), ghProvider).catch(returnNull);
  //     const userFib = signInResult?.user.uid ?? '';
  //     const emailFib = signInResult?.user.email ?? '';
  //     const displayNameFib = signInResult?.user.displayName ?? '';
  //     const photoURLFib = signInResult?.user.photoURL ?? '';

  //     setUser((prevUser) => ({
  //       ...prevUser,
  //       id: userFib as UserId,
  //       email: emailFib,
  //       displayName: displayNameFib,
  //       photoURL: photoURLFib,
  //     }));
  //   } catch (error) {
  //     console.log('ログイン失敗');
  //     throw error;
  //   }
  // };

  // const loginGithub = async () => {
  //   addLoading();
  //   try {
  //     await loginWithGitHub1();
  //     setLoginError('');
  //   } catch (error) {
  //     setLoginError('ログイン失敗');
  //   }
  //   removeLoading();
  // };

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
      setLoginError(''); // ログインが成功したらエラーメッセージをクリア
      await signInWithEmail1(email, password);

      await router.push('/');
    } catch (error) {
      setLoginError('ログインに失敗しました'); // ログイン失敗時のメッセージを設定
    }

    removeLoading();
  };

  const handleChange = async () => {
    await router.push('/register');
  };

  // const [dev, setDev] = useState(true);
  // const checkdev = useCallback(() => {
  //   if (process.env.NEXT_PUBLIC_AUTH_EMULATORURL !== undefined) {
  //     setDev(true);
  //   } else {
  //     setDev(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log('checkdev起動');
  //   checkdev();
  // }, [checkdev]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <img
          className={styles.appImage}
          src="/images/applogo1.png"
          alt="APP logo"
          style={{
            position: 'relative',
            right: '-5px',
            top: '-15px',
          }}
        />
        <img className={styles.logoImage} src="/images/logo.png" alt="ARMapConnect Logo" />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            width: '100%',
            maxWidth: 400, // レスポンシブ対応のための最大幅
          }}
        >
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
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handlePasswordVisibility}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={loginEmail}>
            Login
          </Button>
          {loginError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {loginError}
            </Typography>
          )}
        </Box>
        <Typography className={styles.register}>
          アカウントをお持ちでない場合は、
          <span className={styles.registerLink} onClick={handleChange}>
            こちら
          </span>
          から新規登録してください
        </Typography>
      </div>
      {loadingElm}
    </div>
  );
};
export default Login;
