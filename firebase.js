// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9pwS-GOOzHHrGQJ6TBJjqKvve8NINOSc",
  authDomain: "storage-organizer.firebaseapp.com",
  projectId: "storage-organizer",
  storageBucket: "storage-organizer.appspot.com",
  messagingSenderId: "302161098781",
  appId: "1:302161098781:web:f8bca0b71056d8d2f2eef4",
  measurementId: "G-TN9WHJWDTK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, GoogleAuthProvider };

export {firestore};