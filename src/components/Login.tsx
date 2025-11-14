import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export const Login = () => {
  const { signInWithGoogle, signUpWithGoogle, getErrorMessage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (isSignUpFlow: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUpFlow) {
        await signUpWithGoogle();
      } else {
        await signInWithGoogle();
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error(`Failed to ${isSignUpFlow ? 'sign up' : 'sign in'}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    setIsSignUp(false);
    handleAuth(false);
  };

  const handleSignUp = () => {
    setIsSignUp(true);
    handleAuth(true);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💰 Disadventurous Capitalist</h1>
        <p>Welcome to the ultimate incremental clicker game!</p>
        
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="auth-buttons">
          <button
            className={`google-auth-btn sign-in-btn ${loading ? 'loading' : ''}`}
            onClick={handleSignIn}
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading && !isSignUp ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className={`google-auth-btn sign-up-btn ${loading ? 'loading' : ''}`}
            onClick={handleSignUp}
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading && isSignUp ? 'Signing up...' : 'Sign up with Google'}
          </button>
        </div>

        <p className="login-note">
          {isSignUp 
            ? 'Create an account to save your progress in the cloud' 
            : 'Sign in to save your progress in the cloud'}
        </p>
      </div>
    </div>
  );
};

