// ─── Firebase Client Configuration ───────────────────────────────────────────
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Prevent re-initialization in Next.js hot reload
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app     = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth    = getAuth(app);
  db      = getFirestore(app);
  storage = getStorage(app);
} catch (e) {
  // Firebase failed to init — app still runs without auth
  console.warn('[AniStreamBD] Firebase not configured — auth features disabled.');
  // @ts-ignore
  app = null; auth = null; db = null; storage = null;
}

// Analytics — only runs on client (browser)
export async function initAnalytics() {
  if (typeof window === 'undefined' || !app) return null;
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    const supported = await isSupported();
    if (supported) return getAnalytics(app);
  } catch {}
  return null;
}

export { auth, db, storage };
export default app!;
