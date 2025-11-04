// Servicio para manejar las llamadas a la API

import axios from 'axios';

// Determinar la URL base según el entorno
// FORZAR localhost en desarrollo - Si estás en localhost, siempre usar proxy
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.port === '3000' ||
                      window.location.port === '3001' ||
                      !window.location.hostname;

// Prioridad: 1) Variable de entorno, 2) Desarrollo local (proxy), 3) Producción
// TEMPORAL: Forzar localhost para desarrollo - cambiar a false cuando esté listo para producción
const FORCE_LOCALHOST = true; // Cambiar a false para producción

let API_BASE_URL;
if (FORCE_LOCALHOST && isDevelopment) {
  API_BASE_URL = ''; // Forzar proxy para desarrollo
} else if (process.env.REACT_APP_API_URL) {
  API_BASE_URL = process.env.REACT_APP_API_URL;
} else if (isDevelopment) {
  API_BASE_URL = ''; // Ruta vacía para usar el proxy configurado en package.json
} else {
  API_BASE_URL = 'https://server-mi-biblioteca-personal.onrender.com';
}

// Log para debug - SIEMPRE mostrar
console.log('🔧 ============================================');
console.log('🔧 API Base URL:', API_BASE_URL || '(proxy -> localhost:3001)');
console.log('🔧 Hostname:', window.location.hostname);
console.log('🔧 Port:', window.location.port);
console.log('🔧 isDevelopment:', isDevelopment);
console.log('🔧 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('🔧 ============================================');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const gameAPI = {
  // Obtener información del servidor
  getServerInfo: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // Obtener información del juego
  getGameInfo: async () => {
    const response = await api.get('/api/game/info');
    return response.data;
  },

  // Obtener estadísticas de un jugador
  getPlayerStats: async (playerName) => {
    const response = await api.get(`/api/game/stats/${encodeURIComponent(playerName)}`);
    return response.data;
  },

  // Obtener leaderboard
  getLeaderboard: async (limit = 10) => {
    const response = await api.get(`/api/game/leaderboard?limit=${limit}`);
    return response.data;
  },

  // Obtener preguntas
  getQuestions: async (limit = 10, category = null, difficulty = null) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    const response = await api.get(`/api/game/questions?${params}`);
    return response.data;
  },

  // Verificar estado del servidor
  checkServerStatus: async () => {
    try {
      const response = await api.get('/api/game/info');
      return { status: 'online', data: response.data };
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  }
};

export const authAPI = {
  register: async ({ name, email, password }) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    const data = response.data || {};
    return { success: data.success !== false, ...data };
  },
  login: async ({ identifier, password }) => {
    const response = await api.post('/api/auth/login', { identifier, password });
    const data = response.data || {};
    return { success: data.success !== false, ...data };
  }
};

export const libraryAPI = {
  search: async (q) => {
    const response = await api.get(`/api/library/search`, { params: { q } });
    return response.data;
  },
  add: async ({ userId, book, status }) => {
    const response = await api.post(`/api/library/add`, { userId, book, status });
    return response.data;
  },
  getUserLibrary: async (userId) => {
    const response = await api.get(`/api/library/user/${encodeURIComponent(userId)}`);
    return response.data;
  },
  getDetail: async (id, editionId) => {
    const response = await api.get(`/api/library/book/${encodeURIComponent(id)}`, { params: editionId ? { edition: editionId } : {} });
    return response.data;
  },
  updateStatus: async ({ userId, bookId, status }) => {
    const response = await api.put(`/api/library/update-status`, { userId, bookId, status });
    return response.data;
  },
  getLeaderboard: async (limit = 100) => {
    const response = await api.get(`/api/library/leaderboard`, { params: { limit } });
    return response.data;
  },
  getUserProgress: async (userId) => {
    const response = await api.get(`/api/library/user-progress/${encodeURIComponent(userId)}`);
    return response.data;
  },
  getAchievements: async (userId) => {
    const response = await api.get(`/api/library/achievements/${encodeURIComponent(userId)}`);
    return response.data;
  },
  checkAchievements: async (userId) => {
    const response = await api.post(`/api/library/check-achievements/${encodeURIComponent(userId)}`);
    return response.data;
  },
  getHistory: async (userId, bookId = null) => {
    const params = bookId ? { bookId } : {};
    const response = await api.get(`/api/library/history/${encodeURIComponent(userId)}`, { params });
    return response.data;
  },
  recalculateXP: async (userId) => {
    const response = await api.post(`/api/library/recalculate-xp/${encodeURIComponent(userId)}`);
    return response.data;
  }
};

export const translateAPI = {
  translate: async (text, to = 'es', from = 'auto') => {
    const response = await api.post('/api/translate', { text, to, from });
    return response.data;
  }
};

export default api;
