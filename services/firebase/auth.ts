// ─── Firebase Authentication Service ─────────────────────────────────────────
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

function checkAuth() {
  if (!auth) throw new Error('Firebase Auth not configured. Add your Firebase keys to .env.local');
}

// ── Sign in with Email & Password ──
export async function loginWithEmail(email: string, password: string) {
  checkAuth();
  const result = await signInWithEmailAndPassword(auth!, email, password);
  return result.user;
}

// ── Register with Email & Password ──
export async function registerWithEmail(email: string, password: string, displayName: string) {
  checkAuth();
  const result = await createUserWithEmailAndPassword(auth!, email, password);
  await updateProfile(result.user, { displayName });
  await createUserDocument(result.user, { displayName });
  return result.user;
}

// ── Sign in with Google ──
export async function loginWithGoogle() {
  checkAuth();
  const result = await signInWithPopup(auth!, googleProvider);
  await createUserDocument(result.user, {});
  return result.user;
}

// ── Sign Out ──
export async function logout() {
  if (!auth) return;
  await signOut(auth);
}

// ── Send Password Reset Email ──
export async function resetPassword(email: string) {
  checkAuth();
  await sendPasswordResetEmail(auth!, email);
}

// ── Create/Merge User Document in Firestore ──
async function createUserDocument(user: User, additionalData: Record<string, any>) {
  if (!user || !db) return;
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'user',
      favorites: { teams: [], leagues: [], matches: [] },
      createdAt: serverTimestamp(),
      ...additionalData,
    });
  }
}

// ── Auth State Observer ──
export function observeAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export { auth };
