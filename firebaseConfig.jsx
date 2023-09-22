import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCGXwVYVt2yTbdQ_qmzQdcBWZB1uWMDzU",
  authDomain: "inventariocne.firebaseapp.com",
  projectId: "inventariocne",
  storageBucket: "inventariocne.appspot.com",
  messagingSenderId: "865037030686",
  appId: "1:865037030686:web:211168222771edffc4a50f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };
