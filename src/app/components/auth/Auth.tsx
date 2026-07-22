import React, { useState } from 'react';
import { auth } from '../../../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { Mail, Lock, LogIn, UserPlus, Loader2 } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (userId: string) => void;
  onLogout: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess(userCredential.user.uid);
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login instead.');
      } else if (err.code === 'auth/user-not-found') {
        setError('User not found. Please register first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? 'Sign in to access your tasks'
            : 'Register to start managing your tasks'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="auth-email"><Mail size={14} /> Email</label>
            <input
              type="email"
              id="auth-email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password"><Lock size={14} /> Password</label>
            <input
              type="password"
              id="auth-password"
              name="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="loading-spinner" /> Loading...
              </>
            ) : isLogin ? (
              <>
                <LogIn size={18} /> Login
              </>
            ) : (
              <>
                <UserPlus size={18} /> Register
              </>
            )}
          </button>
        </form>

        <button
          className="auth-switch-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};