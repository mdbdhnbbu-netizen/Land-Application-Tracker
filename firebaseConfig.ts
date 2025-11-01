// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// ========================================================================================
// !!! গুরুত্বপূর্ণ নিরাপত্তা সতর্কতা !!!
// আপনার Firebase কনফিগারেশন কী-গুলো এখানে সরাসরি রাখবেন না যদি এই কোডটি GitHub-এর মতো
// পাবলিক রিপোজিটরিতে থাকে। আপনার কী-গুলো প্রকাশিত (exposed) হয়ে গেছে।
//
// আপনার করণীয়:
// ১. আপনার Firebase প্রজেক্ট কনসোলে যান এবং আপনার Web App-এর API কী টি újra তৈরি করুন (regenerate)।
// ২. নিচের প্লেসহোল্ডারগুলো আপনার নতুন কী দিয়ে প্রতিস্থাপন করুন।
// ৩. আপনার প্রজেক্টের রুটে একটি `.gitignore` ফাইল তৈরি করুন (যদি না থাকে) এবং এতে `firebaseConfig.ts`
//    লাইনটি যোগ করুন, যাতে এই ফাইলটি আর কখনো গিটহাবে আপলোড না হয়।
// ========================================================================================

// আপনার নতুন Firebase প্রজেক্টের কনফিগারেশন এখানে পেস্ট করুন।
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // এখানে আপনার কী বসান
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // (ঐচ্ছিক)
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
