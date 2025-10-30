// Configuración de la aplicación

export const APP_CONFIG = {
  // Configuración del servidor
  SERVER: {
    URL: process.env.REACT_APP_SERVER_URL || 'https://server-mi-biblioteca-personal.onrender.com',
    TIMEOUT: 10000,
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 1000
  },

  // Configuración del juego
  GAME: {
    QUESTION_TIME_LIMIT: 30000, // 30 segundos
    TOTAL_QUESTIONS: 10,
    MIN_PLAYERS_TO_START: 2,
    MAX_PLAYERS_PER_ROOM: 6,
    RESULTS_DISPLAY_TIME: 5000, // 5 segundos
    NEXT_QUESTION_DELAY: 2000 // 2 segundos
  },

  // Configuración de puntuación
  SCORING: {
    BASE_POINTS: 1000,
    TIME_BONUS_MULTIPLIER: 1.0,
    CORRECT_ANSWER_BONUS: 0
  },

  // Configuración de la UI
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 4000,
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100
  },

  // Configuración de validación
  VALIDATION: {
    USERNAME_MIN_LENGTH: 2,
    USERNAME_MAX_LENGTH: 20,
    ROOM_CODE_LENGTH: 6,
    MAX_ROOM_CODE_ATTEMPTS: 3
  },

  // Configuración de notificaciones
  NOTIFICATIONS: {
    ENABLED: true,
    SOUND_ENABLED: false,
    VIBRATION_ENABLED: false
  },

  // Configuración de desarrollo
  DEVELOPMENT: {
    DEBUG_MODE: process.env.NODE_ENV === 'development',
    LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    MOCK_DATA: false
  }
};

// Eventos de Socket.IO
export const SOCKET_EVENTS = {
  // Cliente → Servidor
  CLIENT: {
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    START_GAME: 'start_game',
    SUBMIT_ANSWER: 'submit_answer',
    PLAYER_READY: 'player_ready',
    DISCONNECT: 'disconnect'
  },
  
  // Servidor → Cliente
  SERVER: {
    JOIN_RESULT: 'join_result',
    LEAVE_RESULT: 'leave_result',
    START_RESULT: 'start_result',
    ANSWER_RESULT: 'answer_result',
    PLAYER_JOINED: 'player_joined',
    PLAYER_LEFT: 'player_left',
    GAME_STARTED: 'game_started',
    NEW_QUESTION: 'new_question',
    ANSWER_RECEIVED: 'answer_received',
    QUESTION_RESULTS: 'question_results',
    GAME_FINISHED: 'game_finished',
    ERROR: 'error'
  }
};

// Categorías de preguntas
export const QUESTION_CATEGORIES = [
  'Historia',
  'Ciencia',
  'Deportes',
  'Literatura',
  'Geografía',
  'Música',
  'Arte',
  'Tecnología',
  'Matemáticas',
  'Biología',
  'Cultura General',
  'Cine'
];

// Niveles de dificultad
export const DIFFICULTY_LEVELS = [
  'Fácil',
  'Medio',
  'Difícil'
];

// Colores para categorías
export const CATEGORY_COLORS = {
  'Historia': '#ef4444',
  'Ciencia': '#3b82f6',
  'Deportes': '#10b981',
  'Literatura': '#8b5cf6',
  'Geografía': '#f59e0b',
  'Música': '#ec4899',
  'Arte': '#6366f1',
  'Tecnología': '#14b8a6',
  'Matemáticas': '#f97316',
  'Biología': '#059669',
  'Cultura General': '#6b7280',
  'Cine': '#f43f5e'
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: 'No se pudo conectar al servidor',
  ROOM_NOT_FOUND: 'Sala no encontrada',
  ROOM_FULL: 'La sala está llena',
  INVALID_ROOM_CODE: 'Código de sala inválido',
  USERNAME_TAKEN: 'El nombre de usuario ya está en uso',
  GAME_ALREADY_STARTED: 'El juego ya ha comenzado',
  INSUFFICIENT_PLAYERS: 'Se necesitan más jugadores para iniciar',
  INVALID_ANSWER: 'Respuesta inválida',
  TIME_EXPIRED: 'Tiempo agotado',
  SERVER_ERROR: 'Error del servidor'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  CONNECTED: 'Conectado al servidor',
  ROOM_JOINED: 'Te has unido a la sala',
  GAME_STARTED: '¡El juego ha comenzado!',
  ANSWER_SUBMITTED: 'Respuesta enviada',
  GAME_FINISHED: '¡Juego terminado!',
  ROOM_CODE_COPIED: 'Código copiado al portapapeles'
};

export default APP_CONFIG;
