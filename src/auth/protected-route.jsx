import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";
const ProtectedRoute = ({ children ,path }) => {
  const { user } = useUserAuth();

 

  if (!user) {
    return <Navigate to="/" />;
  }

  if (children.type.name === "MostrarInventarioAD" && user.Tipo !== "Admin" && typeof user.Tipo !== "undefined") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;