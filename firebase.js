import { initializeApp } from "firebase/app";
import { collection, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDCQ7Oh___qwbmec7ogI7hXftRRQomUGtM",
  authDomain: "notes-app-1c8de.firebaseapp.com",
  projectId: "notes-app-1c8de",
  storageBucket: "notes-app-1c8de.appspot.com",
  messagingSenderId: "456345498542",
  appId: "1:456345498542:web:6fbbf815256aa90dc9ce3f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, 'newNotes')