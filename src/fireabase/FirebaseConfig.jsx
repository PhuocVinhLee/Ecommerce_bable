// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBRGtv084MngAt7SF5CA_N0SmrGoUMuQ-0",
  authDomain: "ecommerce--ytb-devknus.firebaseapp.com",
  projectId: "ecommerce--ytb-devknus",
  storageBucket: "ecommerce--ytb-devknus.appspot.com",
  messagingSenderId: "787121249232",
  appId: "1:787121249232:web:33feedea82737fc4c1f7d5",
  measurementId: "G-NJPTPXMXX6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const fireDB = getFirestore(app)
const auth = getAuth(app);

export {fireDB, auth}