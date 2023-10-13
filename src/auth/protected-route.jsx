import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";
const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();
  const { userTipo } = useUserAuth();
  const { loading } = useUserAuth();
  console.log("Check user in loading: ", loading);
  if (!user) {
    return <Navigate to="/" />;
  }
  if (!loading) {
    if (
      userTipo !== "Admin" &&
      window.location.pathname === "/MostrarInventarioAD"
    ) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
