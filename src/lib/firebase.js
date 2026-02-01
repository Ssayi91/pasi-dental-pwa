// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGtqaHhObtyqb_Tda7beeZmYv7lBuIi5E",
  authDomain: "pasi-dental.firebaseapp.com",
  projectId: "pasi-dental",
  storageBucket: "pasi-dental.firebasestorage.app",
  messagingSenderId: "284552111523",
  appId: "1:284552111523:web:f33981c11a1fab81b62616",
  measurementId: "G-5MDNMPVDD4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


// For debugging only
if (typeof window !== 'undefined') {
  window.firebaseAuth = auth;
}