import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBRrYAAG7xQQ45S94Qf0yeUvjXuhx01PT0',
  authDomain: 'todo-ece42.firebaseapp.com',
  projectId: 'todo-ece42',
  storageBucket: 'todo-ece42.appspot.com',
  messagingSenderId: '263737591995',
  appId: '1:263737591995:web:e437cfd056c0d7da65019e',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db };
