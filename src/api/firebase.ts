import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const API_KEY = process.env.REACT_APP_API_KEY;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'weatherforecast-df25c.firebaseapp.com',
  projectId: 'weatherforecast-df25c',
  storageBucket: 'weatherforecast-df25c.appspot.com',
  messagingSenderId: '673232563986',
  appId: '1:673232563986:web:f3c12aa23b61ba53158dcb',
};

const firebaseApp = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(firebaseApp);
