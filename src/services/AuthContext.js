import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from './api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

const HARDCODED_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
  { username: 'mauro', password: 'mauro123', role: 'user', name: 'Mauro' },
  { username: 'guest', password: 'guest', role: 'user', name: 'Invitado' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('auth:user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (_) {
        localStorage.removeItem('auth:user');
      }
    }
  }, []);

  const login = async (identifier, password) => {
    // Intentar contra backend primero
    try {
      const res = await authAPI.login({ identifier, password });
      if (res?.success) {
        const apiUser = res.user;
        const authUser = { 
          id: apiUser.id,
          email: apiUser.email,
          username: apiUser.username,
          name: apiUser.username,
          role: 'user'
        };
        setUser(authUser);
        localStorage.setItem('auth:user', JSON.stringify(authUser));
        return { success: true };
      }
    } catch (_) {
      // Ignorar y probar hardcoded
    }

    // Fallback a usuarios hardcodeados
    const found = HARDCODED_USERS.find(u => u.username === identifier && u.password === password);
    if (!found) return { success: false, error: 'Credenciales inválidas' };
    const localUser = { username: found.username, role: found.role, name: found.name };
    setUser(localUser);
    localStorage.setItem('auth:user', JSON.stringify(localUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth:user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


