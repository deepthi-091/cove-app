// Firebase configuration
// Setup instructions:
// 1. Go to https://console.firebase.google.com and create a project
// 2. Add a Web app to your project
// 3. Copy the config values into a .env file at the project root (see .env.example)
// 4. Enable Authentication (Email/Password) in Firebase console
// 5. Create Firestore and Realtime Database in Firebase console

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getDatabase, type Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean =>
  !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;
let firebaseDb: Firestore | undefined;
let firebaseRtdb: Database | undefined;

if (isFirebaseConfigured()) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
    firebaseRtdb = getDatabase(firebaseApp);
  } catch (error) {
    console.warn('[Firebase] Initialization failed. Check your config:', error);
  }
}

export { firebaseApp, firebaseAuth, firebaseDb, firebaseRtdb };
