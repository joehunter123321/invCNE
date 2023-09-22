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

auth.onAuthStateChanged((user, userData) => {
  if (user) {
    const uid = user.uid;

    const db = getFirestore();
    const userRef = doc(db, "Usuario", uid);

    getDoc(userRef)
      .then((doc) => {
        if (doc.exists()) {
          const Tipo = doc.data().Tipo;
          console.log("Tipo:", Tipo);

          const userData = {
            user: user,
            Tipo: Tipo,
          };

          console.log("Combined data:", userData);
        } else {
          console.log("User document does not exist");
        }
      })
      .catch((error) => {
        console.log("Error fetching user document:", error);
      });
  } else {
    console.log("User is signed out");
  }
});

export { db, auth };
