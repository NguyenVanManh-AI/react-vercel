// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQhtsPcRts0FMwyu58l8Us04t8KGfQRP8",
  authDomain: "elister-health-care.firebaseapp.com",
  projectId: "elister-health-care",
  storageBucket: "elister-health-care.appspot.com",
  messagingSenderId: "448956463522",
  appId: "1:448956463522:web:0cea37e784ece00b3f5afb",
  measurementId: "G-SC1NVDH3EP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
