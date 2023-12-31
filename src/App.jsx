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
import Inventario from "./components/Inventario/Inventario";

import MostrarInventario from "./components/Inventario/mostrarInventario";
import MostrarInventarioAD from "./components/Inventario/MostrarInventarioAD";

export const ColorContext = createContext();

const { Header, Content, Footer } = Layout;

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(true);

  ////////////////////////////////

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Navbar user={user} />
      </Header>
      <Content
        className="site-layout"
        style={{
          paddingTop: "10px",
          paddingBottom: "108px",
        }}
      >
        <div
          style={{
            minHeight: 380,
            background: colorBgContainer,
          }}
        >
          <UserAuthContextProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/Inventario"
                  element={
                    <ProtectedRoute>
                      <Inventario user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/MostrarInventario"
                  element={
                    <ProtectedRoute>
                      <MostrarInventario user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/MostrarInventarioAD"
                  element={
                    <ProtectedRoute>
                      <MostrarInventarioAD user={user} />
                    </ProtectedRoute>
                  }
                />

                <Route path="/" element={<Login />} />
                
              </Routes>
            </BrowserRouter>
          </UserAuthContextProvider>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      ></Footer>
    </Layout>
  );
};

export default App;
