import { Button, TextField, Typography } from '@mui/material';
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

  const signInWithEmail1 = async (email: string, password: string) => {
    const auth = createAuth();
    try {
      const signInResult = await signInWithEmailAndPassword(auth, email, password);
      const userFib = signInResult.user.uid;

      const userInfo = { id: userFib, email: '', displayName: '', photoURL: '' };

      setUser(userInfo);

      localStorage.setItem('user', JSON.stringify(userInfo));
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

  return (
    <div className={styles.container}>
      <div
        id="icon"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '80px',
        }}
      >
        <div style={{ paddingTop: '30px' }}>
          <img
            // className={styles.appImage}

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
      <div id="input" style={{ paddingTop: '60px' }}>
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
          <Button variant="contained" sx={{ mt: 3 }} onClick={loginEmail}>
            Login
          </Button>
          {loginError && (
            <Typography color="error" sx={{ mt: 3 }}>
              {loginError}
            </Typography>
          )}
        </div>
      </div>
      <div>
        <div style={{ textAlign: 'center', paddingTop: '30px' }}>
          <Typography>
            <h3>
              アカウントをお持ちでない場合は、
              <span className={styles.registerLink} onClick={handleChange}>
                こちら
              </span>
              から新規登録してください
            </h3>
          </Typography>
        </div>
      </div>

      {loadingElm}
    </div>
  );
};
export default Login;
