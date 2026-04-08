import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, authReady } = useContext(AuthContext);
  const location = useLocation();

  if (!authReady) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
