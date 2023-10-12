import React, { useState, useEffect, createContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//firebase
import { db } from "../firebaseConfig";
import { Layout, theme } from "antd";
import Inicio from "./components/home/Inicio";
import Login from "./components/Login/Logjn";

import ProtectedRoute from "./auth/protected-route";
import { UserAuthContextProvider } from "./auth/UserAuthContext";

import { auth } from "../firebaseConfig";

import MostrarInventario from "./components/Inventario/mostrarInventario";
import MostrarInventarioAD from "./components/Inventario/MostrarInventarioAD";
import { useUserAuth } from "./auth/UserAuthContext";

import AsignarInventario from "./components/Inventario/AsignarInventario";
import TestNav from "./components/Navbar/TestNav";
import Inventario from "./components/Inventario/inventario";
import CustomFooter from "./components/Footer/CustomFooter";
import AddMaletas from "./components/Inventario/AddMaletas";
import BuscarMaletas from "./components/Inventario/BuscarMaletas";
import AddInventario from "./components/Inventario/AddInventario";
import DynamicFieldsForm from "./components/Inventario/DynamicFieldsForm";
import CustomForm from "./components/Inventario/CustomForm";
import MostrarMaletaTotal from "./components/Inventario/MostrarMaletaTotal";
import Signup from "./components/Login/Signup";
import CryptoJS from "crypto-js";
export const ColorContext = createContext();
const encryptionKey = import.meta.env.VITE_KEYS;
const { Header, Content, Footer } = Layout;

const App = () => {
  const { user, userTipo, userIdentidad, Nombre, loading, ConfiguracionData } =
    useUserAuth();
   
  
  // Función para obtener el usuario almacenado en localStorage y descifrarlo
  const getUserFromLocalStorage = () => {
    const encryptedUserData = localStorage.getItem("userData");
    if (encryptedUserData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUserData, encryptionKey);
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
  const userDataFromLocalStorage = getUserFromLocalStorage();
  // Usar los datos del usuario del localStorage si están disponibles, de lo contrario, usa los datos del contexto
  const userToUse = userDataFromLocalStorage || user;
  const userTipoToUse = userDataFromLocalStorage
    ? userDataFromLocalStorage.Tipo
    : userTipo;
  const userIdentidadToUse = userDataFromLocalStorage
    ? userDataFromLocalStorage.Identidad
    : userIdentidad;
  const NombreToUse = userDataFromLocalStorage
    ? userDataFromLocalStorage.Nombre
    : Nombre;

  // Ahora puedes acceder a los datos del usuario en userToUse, userTipoToUse, userIdentidadToUse y NombreToUse
  console.log("Usuario a usar:", userToUse);
  console.log("Tipo de Usuario a usar:", userTipoToUse);
  console.log("Identidad a usar:", userIdentidadToUse);
  console.log("Nombre a usar:", NombreToUse);

  //const { user } = useUserAuth();
  // const { loading } = useUserAuth();
  // const { userTipo } = useUserAuth();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  ////////////////////////////////

  return (
    <UserAuthContextProvider>
      <BrowserRouter>
        <Layout>
          <Header
            style={{
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <Navbar
              user={userToUse}
              loading={loading}
              userTipo={userTipoToUse}
            />
          </Header>

          <Content
            className="site-layout"
            style={{
              paddingRight: "5%",
              paddingLeft: "5%",
              marginBottom: "50px",
              height: "100vh",
            }}
          >
            <div
              style={{
                textAlign: "center",
                background: colorBgContainer,
              }}
            >
              <Routes>
                <Route
                  path="/AgregarMaletas"
                  element={
                    <ProtectedRoute>
                      <AddMaletas
                        ConfiguracionData={ConfiguracionData}
                        user={userToUse}
                        loading={loading}
                        userTipo={userTipoToUse}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AgragarLogistica"
                  element={
                    <ProtectedRoute>
                      <AddInventario
                        user={userToUse}
                        loading={loading}
                        userTipo={userTipoToUse}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/BuscarLogistica"
                  element={
                    <ProtectedRoute>
                      <AsignarInventario
                        user={userToUse}
                        loading={loading}
                        userTipo={userTipoToUse}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/BuscarMaletas"
                  element={
                    <ProtectedRoute>
                      <BuscarMaletas
                        user={userToUse}
                        loading={loading}
                        userTipo={userTipoToUse}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AgregarCategorias"
                  element={
                    <div>
                      {" "}
                      <DynamicFieldsForm />{" "}
                    </div>
                  }
                />
                <Route
                  path="/MostrarMaletasTotal"
                  element={
                    <div>
                      {" "}
                      <MostrarMaletaTotal />{" "}
                    </div>
                  }
                />

                <Route
                  path="/Registro"
                  element={
                    <div>
                      {" "}
                      <Signup />{" "}
                    </div>
                  }
                />

                <Route path="/" element={<Login />} />
              </Routes>
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            <CustomFooter />
          </Footer>
        </Layout>
      </BrowserRouter>
    </UserAuthContextProvider>
  );
};

export default App;
