import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  AuthError,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getErrorMessage: (error: unknown) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get user-friendly error messages
const getFirebaseErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'code' in error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/cancelled-popup-request':
        return 'Only one popup request is allowed at a time. Please try again.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please try again.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. Please check your Firebase configuration.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations. Please check your Firebase configuration.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/auth-domain-config-required':
        return 'Firebase Authentication domain is not configured. Please check your Firebase configuration.';
      default:
        return `Authentication error: ${authError.message || 'Unknown error occurred'}`;
    }
  }
  return 'An unexpected error occurred. Please try again.';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authenticateWithGoogle = async (isSignUp: boolean = false) => {
    try {
      // signInWithPopup automatically handles both sign-in and sign-up
      // If the user doesn't exist, it creates a new account
      // If the user exists, it signs them in
      const result = await signInWithPopup(auth, googleProvider);
      
      // Verify we got a credential (though not strictly necessary)
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) {
        throw new Error('Failed to get credential from result');
      }
      
      // Return the user - Firebase Auth automatically creates accounts for new users
      return result.user;
    } catch (error) {
      console.error(`Error ${isSignUp ? 'signing up' : 'signing in'} with Google:`, error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    await authenticateWithGoogle(false);
  };

  const signUpWithGoogle = async () => {
    await authenticateWithGoogle(true);
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getErrorMessage = (error: unknown): string => {
    return getFirebaseErrorMessage(error);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
    getErrorMessage,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

