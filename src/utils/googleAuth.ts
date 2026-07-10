import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getAuth } from 'firebase/auth';

export const getGoogleAccessToken = () => {
  return sessionStorage.getItem('google_access_token');
};

export const setGoogleAccessToken = (token: string | null) => {
  if (token) {
    sessionStorage.setItem('google_access_token', token);
  } else {
    sessionStorage.removeItem('google_access_token');
  }
};

export const signInWithGoogleForScopes = async (auth: any) => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://mail.google.com/');
  provider.addScope('https://www.googleapis.com/auth/gmail.addons.current.action.compose');
  provider.addScope('https://www.googleapis.com/auth/gmail.addons.current.message.action');
  provider.addScope('https://www.googleapis.com/auth/gmail.addons.current.message.metadata');
  provider.addScope('https://www.googleapis.com/auth/gmail.addons.current.message.readonly');
  provider.addScope('https://www.googleapis.com/auth/gmail.compose');
  provider.addScope('https://www.googleapis.com/auth/gmail.insert');
  provider.addScope('https://www.googleapis.com/auth/gmail.labels');
  provider.addScope('https://www.googleapis.com/auth/gmail.metadata');
  provider.addScope('https://www.googleapis.com/auth/gmail.modify');
  provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
  provider.addScope('https://www.googleapis.com/auth/gmail.send');
  provider.addScope('https://www.googleapis.com/auth/gmail.settings.basic');
  provider.addScope('https://www.googleapis.com/auth/gmail.settings.sharing');

  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      await signInWithRedirect(auth, provider);
      return null;
    } else {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
      }
      return result;
    }
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};
