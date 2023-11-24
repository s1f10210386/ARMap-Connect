import type { FirebaseError } from 'firebase/app';
import {
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { createAuth } from 'src/utils/firebase';
import { apiClient } from './apiClient';
import { returnNull } from './returnNull';

export const loginWithGitHub = async () => {
  const ghProvider = new GithubAuthProvider();
  ghProvider.addScope('read:user');

  await signInWithPopup(createAuth(), ghProvider).catch(returnNull);
};

export const logout = async () => {
  await createAuth().signOut();
};

//新規ユーザだった場合DBにユーザ登録
const checkIfNewUser = async (user: string) => {
  const existingUsers = await apiClient.user.$get({ query: { userID: user } });
  if (existingUsers.length === 0) {
    await apiClient.user.post({ body: { userID: user } }).catch(returnNull);
  }
};

export const authWithEmail = async (email: string, password: string) => {
  const auth = createAuth();
  try {
    const signInResult = await signInWithEmailAndPassword(auth, email, password);
    const user = signInResult.user.uid;
    await checkIfNewUser(user);
    // setUser();

    console.log('ログイン成功');
  } catch (error) {
    const firebaseError = error as FirebaseError;
    if (firebaseError.code === 'auth/user-not-found') {
      try {
        const signUpResult = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = signUpResult.user.uid;
        await checkIfNewUser(newUser);
        console.log('新規登録成功');
      } catch (signUpError) {
        console.log('新規登録失敗', signUpError);
        return null;
      }
    } else {
      console.error('ログイン失敗', error);
      return null;
    }
  }
};
