import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKQIWCsslDoCn_T2aeW0-NVh5cYOe5FfM",
  authDomain: "safheavn.firebaseapp.com",
  databaseURL: "https://safheavn-default-rtdb.firebaseio.com",
  projectId: "safheavn",
  storageBucket: "safheavn.firebasestorage.app",
  messagingSenderId: "119521366811",
  appId: "1:119521366811:web:9f3a8838dfa4c2b653b9be",
  measurementId: "G-4EMZJHQ8N9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const db = getDatabase(app);

export { db, ref, set, onValue };
