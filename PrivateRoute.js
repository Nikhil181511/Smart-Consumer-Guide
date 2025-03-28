// src/components/PrivateRoute.js

import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import { auth } from "./src/firebase";
import { onAuthStateChanged } from "firebase/auth";

// PrivateRoute will render the child components if the user is authenticated
const PrivateRoute = ({ element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
