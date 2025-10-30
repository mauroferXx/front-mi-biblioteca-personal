// Utilidades para el frontend

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatScore = (score) => {
  return score.toLocaleString();
};

export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const validateUsername = (username) => {
  if (!username || username.trim().length < 2) {
    return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (username.trim().length > 20) {
    return { valid: false, error: 'El nombre no puede tener más de 20 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9\s]+$/.test(username.trim())) {
    return { valid: false, error: 'El nombre solo puede contener letras, números y espacios' };
  }
  
  return { valid: true };
};

export const validateRoomCode = (roomCode) => {
  if (!roomCode || roomCode.trim().length !== 6) {
    return { valid: false, error: 'El código de sala debe tener 6 caracteres' };
  }
  
  if (!/^[A-Z0-9]+$/.test(roomCode.trim())) {
    return { valid: false, error: 'El código de sala solo puede contener letras mayúsculas y números' };
  }
  
  return { valid: true };
};

export const getPlayerInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getRandomColor = () => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    return false;
  }
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) {
    return 'hace un momento';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
};

export const calculateScore = (isCorrect, timeSpent, timeLimit = 30000, basePoints = 1000) => {
  if (!isCorrect) return 0;
  
  const timeBonus = Math.max(0, (timeLimit - timeSpent) / timeLimit);
  return Math.round(basePoints * timeBonus);
};

export const getQuestionDifficulty = (question) => {
  // Esta función podría determinar la dificultad basada en la pregunta
  // Por ahora retorna una dificultad aleatoria
  const difficulties = ['Fácil', 'Medio', 'Difícil'];
  return difficulties[Math.floor(Math.random() * difficulties.length)];
};

export const getCategoryColor = (category) => {
  const colors = {
    'Historia': 'bg-red-500',
    'Ciencia': 'bg-blue-500',
    'Deportes': 'bg-green-500',
    'Literatura': 'bg-purple-500',
    'Geografía': 'bg-yellow-500',
    'Música': 'bg-pink-500',
    'Arte': 'bg-indigo-500',
    'Tecnología': 'bg-teal-500',
    'Matemáticas': 'bg-orange-500',
    'Biología': 'bg-emerald-500',
    'Cultura General': 'bg-gray-500',
    'Cine': 'bg-rose-500'
  };
  
  return colors[category] || 'bg-gray-500';
};

export const animateCounter = (element, start, end, duration = 1000) => {
  const startTime = performance.now();
  
  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = Math.floor(start + (end - start) * progress);
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };
  
  requestAnimationFrame(updateCounter);
};
