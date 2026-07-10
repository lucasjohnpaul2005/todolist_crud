import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/redux/store';  // ← Updated path
import App from './App';
import './index.css';
import './App.css';

export const boot = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

if (typeof window !== 'undefined') {
  boot();
}