import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBokXBaLegUcaeWRmifmRi5310NOVj2eYI",
    authDomain: "itd112lab1-595b0.firebaseapp.com",
    projectId: "itd112lab1-595b0",
    storageBucket: "itd112lab1-595b0.firebasestorage.app",
    messagingSenderId: "449291562592",
    appId: "1:449291562592:web:641eba12c42d0a8837dd05",
    measurementId: "G-4NVWDF8587"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export { db, collection, getDocs };
