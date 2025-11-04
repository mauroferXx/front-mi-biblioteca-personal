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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    const saved = localStorage.getItem('auth:user');
    console.log('🔐 AuthContext: Cargando usuario desde localStorage...', saved ? 'Usuario encontrado' : 'No hay usuario guardado');
    
    if (saved) {
      try {
        const parsedUser = JSON.parse(saved);
        console.log('🔐 AuthContext: Usuario cargado:', parsedUser.username);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Error parseando usuario guardado:', error);
        localStorage.removeItem('auth:user');
      }
    }
    setLoading(false);
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
        console.log('🔐 AuthContext: Login exitoso (backend):', authUser.username);
        setUser(authUser);
        localStorage.setItem('auth:user', JSON.stringify(authUser));
        console.log('🔐 AuthContext: Usuario guardado en localStorage');
        return { success: true };
      }
    } catch (error) {
      console.log('⚠️ AuthContext: Login backend falló, probando usuarios hardcoded:', error.message);
      // Ignorar y probar hardcoded
    }

    // Fallback a usuarios hardcodeados
    const found = HARDCODED_USERS.find(u => u.username === identifier && u.password === password);
    if (!found) {
      console.log('❌ AuthContext: Credenciales inválidas');
      return { success: false, error: 'Credenciales inválidas' };
    }
    const localUser = { 
      username: found.username, 
      role: found.role, 
      name: found.name,
      id: `hardcoded-${found.username}` // ID temporal para usuarios hardcoded
    };
    console.log('🔐 AuthContext: Login exitoso (hardcoded):', localUser.username);
    setUser(localUser);
    localStorage.setItem('auth:user', JSON.stringify(localUser));
    console.log('🔐 AuthContext: Usuario guardado en localStorage');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth:user');
  };

  // Función para verificar y sincronizar el estado
  useEffect(() => {
    // Verificar si hay cambios en localStorage (por ejemplo, desde otra pestaña)
    const handleStorageChange = (e) => {
      if (e.key === 'auth:user') {
        if (e.newValue) {
          try {
            const parsedUser = JSON.parse(e.newValue);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parseando usuario desde storage event:', error);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Evitar renderizar hasta cargar el estado inicial
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6b7280' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


