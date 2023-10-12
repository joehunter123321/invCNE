import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import CryptoJS from "crypto-js";
//const encryptionKey = import.meta.env.VITE_KEYS;
const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [userTipo, setUserTipo] = useState(null);
  const [userIdentidad, setUserIdentidad] = useState(null);
  const [Nombre, setUserNombre] = useState(null);
  const [ConfiguracionData, setConfiguracionData] = useState(null);
  const [LoadTipoFormularioData, setLoadTipoFormularioData] = useState(null);

  const [tipoFormulario, setTipoFormulario] = useState(
    localStorage.getItem("TipoFormulario") || "Configuracion"
  );
  // Verificar si ya hay un valor en localStorage, de lo contrario, establecer el valor predeterminado "Campo"
  const tipoFormularioEnLocalStorage = localStorage.getItem("TipoFormulario");
  if (tipoFormularioEnLocalStorage === null) {
    localStorage.setItem("TipoFormulario", "Configuracion");
  }

  console.log("Clave de cifrado segura:", "kJ&Q1.uaQBR&7rdq4Pk(&e@^d.>h*=H.");

  // Función para almacenar el usuario en localStorage con cifrado
  const storeUserInLocalStorage = (userData) => {
    try {
      const encryptedUserData = CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        "kJ&Q1.uaQBR&7rdq4Pk(&e@^d.>h*=H."
      ).toString();
      localStorage.setItem("userData", encryptedUserData);
    } catch (error) {
      console.error(
        "Error al cifrar y almacenar los datos de usuario en Local Storage",
        error
      );
    }
  };

  // Función para obtener el usuario almacenado en localStorage y descifrarlo
  const getUserFromLocalStorage = () => {
    const encryptedUserData = localStorage.getItem("userData");
    if (encryptedUserData) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedUserData,
          "kJ&Q1.uaQBR&7rdq4Pk(&e@^d.>h*=H."
        );
        const decryptedUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedUserData;
      } catch (error) {
        console.error(
          "Error al descifrar y recuperar los datos de usuario desde Local Storage",
          error
        );
      }
    }
    return null;
  };

  // Función para eliminar los datos del usuario del localStorage
  const clearUserFromLocalStorage = () => {
    localStorage.removeItem("userData");
  };
  // Resto del código para logIn, signUp, logOut, useEffect, etc.

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    clearUserFromLocalStorage();
    setLoading(false);
    return signOut(auth);
  }

  function LoadTipoFormulario(Tipo) {
    console.log(`El tipo de formulario es: ${Tipo}`);
    setTipoFormulario("Tipo");
  }

  useEffect(() => {
    const userDataFromLocalStorage = getUserFromLocalStorage();
    if (userDataFromLocalStorage) {
      setUser(userDataFromLocalStorage);
      setLoading(false);
      setUserTipo(userDataFromLocalStorage.Tipo);
      setUserIdentidad(userDataFromLocalStorage.Identidad);
      setUserNombre(userDataFromLocalStorage.Nombre);
    }

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
              const Identidad = doc.data().Identidad;
              const Nombre = doc.data().Nombre;
              const userData = {
                user: currentUser,
                Tipo: Tipo,
                Identidad: Identidad,
                Nombre: Nombre,
              };
              setUser(userData);
              setLoading(false);
              setUserTipo(Tipo);
              setUserIdentidad(Identidad); // Corregido aquí
              setUserNombre(Nombre);

              storeUserInLocalStorage(userData);
            } else {
              console.log("User document does not exist");
            }
          })
          .catch((error) => {
            console.log("Error fetching user document:", error);
          });

        if (tipoFormulario) {
          console.log(`LoadTipoFormularioData: ${tipoFormulario}`);
          const ConfigRef = doc(db, "Configuracion", tipoFormulario);
          getDoc(ConfigRef)
            .then((doc) => {
              if (doc.exists()) {
                const Bloque = doc.data().Bloque;
                const Gondola = doc.data().Gondola;
                const Nivel = doc.data().Nivel;
                const Torre = doc.data().Torre;

                const ConfiguracionData = {
                  Bloque: Bloque,
                  Gondola: Gondola,
                  Nivel: Nivel,
                  Torre: Torre,
                };
                setConfiguracionData(ConfiguracionData);
              } else {
              }
            })
            .catch((error) => {
              console.log("Error fetching user document:", error);
            });
        } else {
          setTipoFormulario("Configuracion");
          console.log(`LoadTipoFormularioData:else`);
          const ConfigRef = doc(db, "Configuracion", "Configuracion");
          getDoc(ConfigRef)
            .then((doc) => {
              if (doc.exists()) {
                const Bloque = doc.data().Bloque;
                const Gondola = doc.data().Gondola;
                const Nivel = doc.data().Nivel;
                const Torre = doc.data().Torre;

                const ConfiguracionData = {
                  Bloque: Bloque,
                  Gondola: Gondola,
                  Nivel: Nivel,
                  Torre: Torre,
                };
                setConfiguracionData(ConfiguracionData);
              }
            })
            .catch((error) => {
              console.log("Error fetching user document:", error);
            });

          console.log("ConfiguracionData document does not exist");
        }
      } else {
        console.log("User is signed out");
        clearUserFromLocalStorage();
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [LoadTipoFormularioData]);
  return (
    <userAuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        loading,
        userTipo,
        userIdentidad,
        Nombre,
        ConfiguracionData,
        LoadTipoFormulario,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
