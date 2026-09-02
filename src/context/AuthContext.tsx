import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import {
  auth,
  buildUserProfileFromAuth,
  signInWithGooglePopup,
} from '../lib/firebase';
import { UserProfile } from '../types';

export interface UnverifiedEmailError extends Error {
  code: 'auth/unverified-email';
  unverifiedEmail: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  unverifiedEmail: string | null;
  setUnverifiedEmail: (email: string | null) => void;
  signIn: (email: string, pass: string) => Promise<UserProfile>;
  signUp: (email: string, pass: string, name: string, role?: UserProfile['role']) => Promise<string>;
  resendVerification: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchUserRole: (role: UserProfile['role']) => Promise<void>;
  loginAsDemoUser: (demo: { name: string; email: string; role: UserProfile['role'] }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'revora_active_auth_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Enforce Firebase Authentication email verification
        if (!fbUser.emailVerified) {
          // Block unverified user & sign out from active session
          try {
            await fbSignOut(auth);
          } catch {
            // ignore
          }
          setCurrentUser(null);
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        } else {
          // Pure Firebase Auth user profile (No Firestore database)
          const profile = buildUserProfileFromAuth(fbUser);
          setCurrentUser(profile);
          try {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          } catch {
            // ignore
          }
        }
      } else {
        // If not logged in and not a demo session, clear
        const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (!parsed.id?.startsWith('usr_demo_') && !parsed.id?.startsWith('usr_rajeyo_admin')) {
              setCurrentUser(null);
              localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            }
          } catch {
            setCurrentUser(null);
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string): Promise<UserProfile> => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanEmail = normalizedEmail.includes('@') ? normalizedEmail : `${normalizedEmail}@gmail.com`;

    // Direct Executive Admin Credentials Bypass & Verification
    if (
      (cleanEmail === 'rajeyoh@gmail.com' || cleanEmail === 'rajeyohgmail.com@gmail.com') &&
      pass === 'Shivangi@316'
    ) {
      const adminProfile: UserProfile = {
        id: 'usr_rajeyo_admin',
        name: 'Rajeyo Haldar',
        email: 'rajeyoh@gmail.com',
        role: 'fintech_admin',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajeyo%20Haldar',
      };
      setCurrentUser(adminProfile);
      setUnverifiedEmail(null);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminProfile));
      return adminProfile;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      
      // Check if email is verified in Firebase Authentication
      if (!cred.user.emailVerified) {
        const userEmail = cred.user.email || cleanEmail;
        // Sign out immediately to block unverified session
        await fbSignOut(auth);
        setCurrentUser(null);
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        setUnverifiedEmail(userEmail);

        const unverifiedErr = new Error(`We have sent you a verification email to ${userEmail}. Please verify it and log in.`) as UnverifiedEmailError;
        unverifiedErr.code = 'auth/unverified-email';
        unverifiedErr.unverifiedEmail = userEmail;
        throw unverifiedErr;
      }

      // Email is verified: construct profile directly from Firebase Authentication
      const profile = buildUserProfileFromAuth(cred.user);
      setCurrentUser(profile);
      setUnverifiedEmail(null);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      return profile;
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/unverified-email') {
        throw fbErr;
      }

      if (
        (cleanEmail === 'rajeyoh@gmail.com' || cleanEmail === 'rajeyohgmail.com@gmail.com') &&
        pass === 'Shivangi@316'
      ) {
        const adminProfile: UserProfile = {
          id: 'usr_rajeyo_admin',
          name: 'Rajeyo Haldar',
          email: 'rajeyoh@gmail.com',
          role: 'fintech_admin',
          avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajeyo%20Haldar',
        };
        setCurrentUser(adminProfile);
        setUnverifiedEmail(null);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminProfile));
        return adminProfile;
      }
      throw fbErr;
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    name: string,
    role: UserProfile['role'] = 'fintech_admin'
  ): Promise<string> => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanEmail = normalizedEmail.includes('@') ? normalizedEmail : `${normalizedEmail}@gmail.com`;

    // 1. Create account with Firebase Authentication
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    
    // 2. Set user display name
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }

    // 3. Send email verification using Firebase Authentication
    await sendEmailVerification(cred.user);

    // 4. Do NOT sign in automatically -> Sign out immediately from Firebase
    const registeredEmail = cred.user.email || cleanEmail;
    await fbSignOut(auth);
    
    // 5. Ensure currentUser is not logged in
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setUnverifiedEmail(registeredEmail);

    return registeredEmail;
  };

  const resendVerification = async (email: string, pass: string): Promise<void> => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanEmail = normalizedEmail.includes('@') ? normalizedEmail : `${normalizedEmail}@gmail.com`;

    // Sign in temporarily to get User object for sendEmailVerification
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    if (!cred.user.emailVerified) {
      await sendEmailVerification(cred.user);
    }
    // Sign out immediately
    await fbSignOut(auth);
    setCurrentUser(null);
  };

  const signInWithGoogle = async () => {
    const user = await signInWithGooglePopup();
    // Google verified accounts automatically have emailVerified === true
    const profile = buildUserProfileFromAuth(user);
    setCurrentUser(profile);
    setUnverifiedEmail(null);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    setUnverifiedEmail(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const switchUserRole = async (role: UserProfile['role']) => {
    if (!currentUser) return;
    let name = currentUser.name;
    let email = currentUser.email;
    if (role === 'fintech_admin') {
      name = 'Rajeyo Haldar';
      email = 'rajeyoh@gmail.com';
    } else if (role === 'recovery_manager') {
      name = 'Shivangi Sharma';
      email = 'shivangi.sharma@revora.ai';
    }

    const updated: UserProfile = {
      ...currentUser,
      role,
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };
    setCurrentUser(updated);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
  };

  const loginAsDemoUser = (demo: { name: string; email: string; role: UserProfile['role'] }) => {
    const profile: UserProfile = {
      id: `usr_demo_${Date.now()}`,
      name: demo.name,
      email: demo.email,
      role: demo.role,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(demo.name)}`,
    };
    setCurrentUser(profile);
    setUnverifiedEmail(null);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        unverifiedEmail,
        setUnverifiedEmail,
        signIn,
        signUp,
        resendVerification,
        signInWithGoogle,
        signOut,
        resetPassword,
        switchUserRole,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

