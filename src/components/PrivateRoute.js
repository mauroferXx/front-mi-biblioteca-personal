import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Log para debug
  console.log('🔒 PrivateRoute: Verificando autenticación...', { isAuthenticated, user: user?.username });

  if (!isAuthenticated) {
    console.log('🔒 PrivateRoute: No autenticado, redirigiendo a login');
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default PrivateRoute;


