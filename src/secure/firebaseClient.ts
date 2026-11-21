/** Copy into current project only AFTER firebase config and secure backend are deployed.
 * npm install firebase
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
export const firebaseApp = firebaseConfigured ? initializeApp(firebaseConfig) : null;
export const secureAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const publicDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const server = firebaseApp ? getFunctions(firebaseApp, 'asia-south1') : null;
