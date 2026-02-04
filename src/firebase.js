import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these with your actual Firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyCKLXNE3JFIfSULFUCFwz0G3XeUb4BNnkg",
    authDomain: "layer1studio-750f4.firebaseapp.com",
    projectId: "layer1studio-750f4",
    storageBucket: "layer1studio-750f4.firebasestorage.app",
    messagingSenderId: "540706846466",
    appId: "1:540706846466:web:7080fcb3c6533dd081f41b",
    measurementId: "G-8YCTMN2X95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
