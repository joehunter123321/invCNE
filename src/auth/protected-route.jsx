import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";
const ProtectedRoute = ({ children }) => {
  const { user, userTipo, loading } = useUserAuth();
  const navigate = useNavigate(); // Obtener la función de navegación
  console.log("Check user in loading: ", loading);
  console.log("ProtectedRoute: ", userTipo);

  useEffect(() => {
    if (loading) {
      return; // Si aún se está cargando, no hagas nada
    }
    if (!user) {
      navigate("/");
    }

    if (
      !loading &&
      userTipo !== "Admin" &&
      userTipo !== "Escritura" &&
      window.location.pathname === "/AgregarMaletass"
    ) {
      navigate("/");
    }
  }, [user, loading, userTipo, navigate]);

  return children;
};
export default ProtectedRoute;
