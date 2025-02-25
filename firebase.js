import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Firebase configuration (use your Firebase credentials here)
const firebaseConfig = {
    apiKey: "AIzaSyC4aNRvVxHbnievs1bEXbn6sZ69AoPXoFA",
    authDomain: "libertyville-historical.firebaseapp.com",
    databaseURL: "https://libertyville-historical-default-rtdb.firebaseio.com",
    projectId: "libertyville-historical",
    storageBucket: "libertyville-historical.firebasestorage.app",
    messagingSenderId: "573948661145",
    appId: "1:573948661145:web:6211a30710ea68ea281708",
    measurementId: "G-K1TN0ZLSPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database, ref, set, push, onValue, signInWithEmailAndPassword, signOut, onAuthStateChanged };
