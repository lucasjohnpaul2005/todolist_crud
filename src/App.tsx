import React, { useState, useEffect } from 'react';
import { useAppDispatch } from './app/redux/hooks';
import { readTasks, switchRepository } from './app/redux/task/task.actions';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { TodoPage } from './app/pages/TodoPage';
import { Auth } from './app/components/auth/Auth';
import './App.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(' App: Auth state:', user ? `Logged in as ${user.email}` : 'Not logged in');
      setUser(user);
      
      //  When user logs in, switch to Firebase and load tasks
      if (user) {
        console.log(' Switching to Firebase repository...');
        dispatch(switchRepository('firebase'));
        dispatch(readTasks());
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2> Pag hulat...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} onLogout={() => {}} />;
  }

  return <TodoPage />;
};

export default App;