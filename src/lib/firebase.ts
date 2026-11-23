import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Persist authenticated sessions across page reloads using Firebase local persistence.
void setPersistence(auth, browserLocalPersistence).catch(() => {
  // Some strict private-browsing contexts fall back automatically to in-memory persistence.
});

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
