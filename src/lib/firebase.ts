import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import { UserProfile } from '../types';

// Web app's Firebase configuration with environment variable support
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB6wJdVmnvwNFlkaEmpXFLaV4D313LB5dc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "revora-ai-a8410.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "revora-ai-a8410",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "revora-ai-a8410.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "784852054954",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:784852054954:web:565d40218f44734689f1d3",
};

// Initialize Firebase Auth strictly (avoid multi-instance re-init)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Auth Provider setup with profile and email scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Sign in / Sign up with Google Popup
 */
export async function signInWithGooglePopup(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    console.warn('Firebase signInWithPopup status:', err?.code || err?.message || err);
    throw err;
  }
}

/**
 * Build UserProfile directly from Firebase Authentication User object
 * (No database / Firestore required - pure Firebase Authentication)
 */
export function buildUserProfileFromAuth(user: FirebaseUser, overrideRole?: UserProfile['role']): UserProfile {
  const email = user.email || 'user@revora.ai';
  const name = user.displayName || email.split('@')[0] || 'Revora Officer';
  return {
    id: user.uid,
    name,
    email,
    role: overrideRole || 'fintech_admin',
    avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
  };
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
};

