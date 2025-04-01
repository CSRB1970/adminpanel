
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfJTToEduo1H_yBraIwfxQh-IoAbVwWGM",
  authDomain: "sri-ram-builders.firebaseapp.com",
  projectId: "sri-ram-builders",
  storageBucket: "sri-ram-builders.firebasestorage.app",
  messagingSenderId: "298397063802",
  appId: "1:298397063802:web:7696978f34a1822c7af9c3",
  measurementId: "G-L5565N6ZYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth, analytics };
