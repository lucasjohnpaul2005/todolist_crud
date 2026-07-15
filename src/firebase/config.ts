import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration gi kuha nako ni sa firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDlDBjWPN5RB94B8-NyfvJhcUAgvSvZPzE",
  authDomain: "todolist-crud-a063e.firebaseapp.com",
  projectId: "todolist-crud-a063e",
  storageBucket: "todolist-crud-a063e.firebasestorage.app",
  messagingSenderId: "396154908535",
  appId: "1:396154908535:web:90d61fd97d89ff0906fb72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);