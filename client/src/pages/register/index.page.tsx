import { Button, IconButton, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import { createAuth } from 'src/utils/firebase';
import { returnNull } from 'src/utils/returnNull';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
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

  const signUpWithEmail1 = async (email1: string, password: string) => {
    const auth = createAuth();
    try {
      const signUpResult = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = signUpResult.user.uid;
      const userInfo = { id: newUser, email: '', displayName: '', photoURL: '' };
      setUser(userInfo);
      await apiClient.user.post({ body: { userID: newUser } }).catch(returnNull);
      localStorage.setItem('user', JSON.stringify(userInfo));
      console.log('新規登録成功');
    } catch (error) {
      console.error('新規登録失敗', error);
      throw error; // エラーを再スローして、呼び出し元でハンドリングできるようにする
    }
  };
  const createAccount = async () => {
    addLoading();

    try {
      setLoginError('');
      await signUpWithEmail1(email, password);

      await router.push('/');
    } catch (error) {
      setLoginError('サインアップに失敗しました'); // ログイン失敗時のメッセージを設定
    }

    removeLoading();
  };

  const randomAccount = () => {
    // 現在の日時をミリ秒で取得
    const now = new Date().getTime();

    // ランダムな数値と現在の時刻を組み合わせてメールアドレスを生成
    const randomEmail = `user${Math.floor(Math.random() * 10000)}${now}@example.com`;

    // ランダムな文字列を生成してパスワードにする
    let randomPassword = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = 14;
    for (let i = 0; i < passwordLength; i++) {
      randomPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // メールアドレスとパスワードを設定
    setEmail(randomEmail);
    setPassword(randomPassword);
  };

  const handleChange = async () => {
    await router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div
        id="icon"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '100px',
        }}
      >
        <div style={{ paddingTop: '30px' }}>
          <img
            src="/images/applogo1.png"
            alt="APP logo"
            style={{
              position: 'relative',
              right: '-5px',
              top: '-15px',
              width: '100px',
              height: 'auto',
            }}
          />
        </div>
        <div>
          <img
            style={{ width: '280px', height: 'auto' }}
            src="/images/logo.png"
            alt="ARMapConnect Logo"
          />
        </div>
      </div>

      <div id="input" style={{ paddingTop: '80px' }}>
        <div style={{ textAlign: 'center', paddingLeft: '30%' }}>
          <Button onClick={randomAccount}>ランダム生成</Button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <TextField
            style={{ width: '70%', minWidth: '250px', maxWidth: '700px' }}
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <TextField
            label="Password"
            style={{ width: '70%', minWidth: '250px', maxWidth: '700px' }}
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
        </div>
      </div>
      <div style={{ paddingTop: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <Button variant="contained" sx={{ mt: 3 }} onClick={createAccount}>
            新規登録
          </Button>
          {loginError && (
            <Typography color="error" sx={{ mt: 3 }}>
              {loginError}
            </Typography>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button
          variant="outlined" // もしくは 'contained' など、他のバリアントを選択
          color="primary" // カラーテーマに応じて変更可能
          sx={{ mt: 2 }} // marginTopを16pxに設定
          onClick={handleChange}
        >
          戻る
        </Button>
      </div>
      {loadingElm}
    </div>
  );
};

export default Register;
