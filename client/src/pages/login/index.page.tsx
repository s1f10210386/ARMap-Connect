import { Box, Button, TextField, Typography } from '@mui/material';
import { APP_TITLE } from 'commonConstantsWithClient';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { GithubIcon } from 'src/components/icons/GithubIcon';
import { authWithEmail, loginWithGitHub } from 'src/utils/login';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

const Login = () => {
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

  const loginEmail = async () => {
    addLoading();

    try {
      await authWithEmail(email, password);
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

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {APP_TITLE}
          </Typography>

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
        </Box>
        {loginError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {loginError}
          </Typography>
        )}

        <div style={{ marginTop: '16px' }} onClick={loginGithub}>
          <div className={styles.btn}>
            <GithubIcon size={18} fill="#fff" />
            <span>GitHubでのログインはこちら</span>
          </div>
        </div>

        <button style={{ marginTop: '16px' }} onClick={handleChange}>
          新規登録
        </button>
      </div>

      {loadingElm}
    </div>
  );
};

export default Login;
