import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase/config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

export const LoginTest: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(' Checking auth state...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(' Auth state:', user ? `Logged in as ${user.email}` : 'Not logged in');
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log(' Login success:', result.user.email);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log(' Register success:', result.user.email);
      }
    } catch (error: any) {
      console.error(' Auth error:', error.code);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    console.log(' Logged out');
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}> Loading...</div>;
  }

  if (user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2> Logged in as: {user.email}</h2>
        <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '16px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <p>{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              required
            />
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '16px', padding: '10px', background: '#fee', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ 
            marginTop: '16px', 
            background: 'none', 
            border: 'none', 
            color: '#667eea',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};