// Servicio para manejar las llamadas a la API

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
    return response.data;
  },
  login: async ({ identifier, password }) => {
    const response = await api.post('/api/auth/login', { identifier, password });
    return response.data;
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
  }
};

export const translateAPI = {
  translate: async (text, to = 'es', from = 'auto') => {
    const response = await api.post('/api/translate', { text, to, from });
    return response.data;
  }
};

export default api;
