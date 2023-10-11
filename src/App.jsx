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
export const ColorContext = createContext();

const { Header, Content, Footer } = Layout;

const App = () => {
  const { user } = useUserAuth();
  const { loading } = useUserAuth();
  const { userTipo } = useUserAuth();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  console.log("Loading", loading);

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
            <Navbar user={user} loading={loading} userTipo={userTipo} />
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
                      <AddMaletas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AgragarLogistica"
                  element={
                    <ProtectedRoute>
                      <AddInventario user={user}
                        loading={loading}
                        userTipo={userTipo} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/BuscarLogistica"
                  element={
                    <ProtectedRoute>
                      <AsignarInventario
                        user={user}
                        loading={loading}
                        userTipo={userTipo}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/BuscarMaletas"
                  element={
                    <ProtectedRoute>
                      <BuscarMaletas
                        user={user}
                        loading={loading}
                        userTipo={userTipo}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Test"
                  element={
                    <div> <DynamicFieldsForm/>  </div>
                   
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
