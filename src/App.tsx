import React, { useState, useEffect } from 'react';
import { useAppDispatch } from './app/redux/hooks';
import { readTasks, switchRepository } from './app/redux/task/task.actions';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { TodoPage } from './app/pages/TodoPage';
import { Auth } from './app/components/auth/Auth';
import { Loader2 } from 'lucide-react';
import './App.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      // When user logs in, switch to Firebase and load tasks
      if (user) {
        dispatch(switchRepository('firebase'));
        dispatch(readTasks());
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="loading-state">
          <Loader2 className="loading-spinner" size={28} />
          <span>Loading...</span>
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