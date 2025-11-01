// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your own Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdJCdFhYEQC-As78N4p87I4ZtV9lZ1ifA",
  authDomain: "land-application-tracker.firebaseapp.com",
  projectId: "land-application-tracker",
  storageBucket: "land-application-tracker.appspot.com",
  messagingSenderId: "823314972123",
  appId: "1:823314972123:web:9db60b91a6800963257bfe",
  measurementId: "G-8YF773CW7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);