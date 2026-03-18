// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5fZuVr7URin2PCK4wCulfTP60Pp0t0hc",
  authDomain: "skillcircle-f9da5.firebaseapp.com",
  projectId: "skillcircle-f9da5",
  storageBucket: "skillcircle-f9da5.firebasestorage.app",
  messagingSenderId: "827926991052",
  appId: "1:827926991052:web:4893222b05cdb3b699f269"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);