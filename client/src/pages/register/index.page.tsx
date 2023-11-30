import { Typography } from '@mui/material';
import { APP_TITLE } from 'commonConstantsWithClient';
import type { UserId } from 'commonTypesWithClient/ids';
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

const Register = () => {
  const [, setUser] = useAtom(userAtom);
  const { loadingElm, addLoading, removeLoading } = useLoading();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loginError, setLoginError] = useState('');

  const signUpWithEmail1 = async (email1: string, password: string) => {
    const auth = createAuth();
    try {
      const signUpResult = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = signUpResult.user.uid;
      setUser((prevUser) => ({
        ...prevUser,
        id: newUser as UserId,
        email: email1,
        displayName: prevUser?.displayName,
        photoURL: prevUser?.photoURL,
      }));
      await apiClient.user.post({ body: { userID: newUser } }).catch(returnNull);
      console.log('新規登録成功');
    } catch (error) {
      console.error('新規登録失敗', error);
      throw error; // エラーを再スローして、呼び出し元でハンドリングできるようにする
    }
  };
  const createAccount = async () => {
    addLoading();

    try {
      // await authWithEmail(email, password);
      await signUpWithEmail1(email, password);
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
