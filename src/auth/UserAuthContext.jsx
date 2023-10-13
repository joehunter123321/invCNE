import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [Nombre, setUserNombre] = useState({});
   const [loading, setLoading] = useState(true);
   const [userTipo, setUserTipo] = useState(null);
   const [userIdentidad, setUserIdentidad] = useState(null);

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const uid = currentUser.uid;

        const db = getFirestore();
        const userRef = doc(db, "Usuario", uid);
        getDoc(userRef)
          .then((doc) => {
            if (doc.exists()) {
              const Tipo = doc.data().Tipo;
              const Identidad=doc.data().Identidad;
              const Nombre=doc.data().Nombre;
              const userData = {
                user: currentUser,
                Tipo: Tipo,
                Identidad: Identidad,
                Nombre: Nombre
              };
              setUser(userData);
              setLoading(false); 
              setUserTipo(Tipo); 
              setUserIdentidad(userIdentidad);  
              setUserNombre(Nombre); 
            } else {
              console.log("User document does not exist");
            }
          })
          .catch((error) => {
            console.log("Error fetching user document:", error);
          });
      } else {
        console.log("User is signed out");
        setLoading(false); 
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider value={{ user, logIn, signUp, logOut ,loading,userTipo,userIdentidad,Nombre}}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
