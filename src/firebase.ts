import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD1xDERTeiWqUKTbxdMC1e6P3yXT8eVbZg",
  authDomain: "holydeo-89035.firebaseapp.com",
  projectId: "holydeo-89035",
  storageBucket: "holydeo-89035.firebasestorage.app",
  messagingSenderId: "148552538042",
  appId: "1:148552538042:web:5b5ff3b7a12c1155956f83",
  measurementId: "G-B63BPR3W3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app; 