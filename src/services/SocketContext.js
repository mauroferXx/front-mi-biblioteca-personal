import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket debe ser usado dentro de SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketInitialized = useRef(false);
  const joiningRoom = useRef(false);
  const questionTimerRef = useRef(null);
  const [gameState, setGameState] = useState({
    roomId: null,
    status: 'disconnected', // disconnected, lobby, playing, finished
    players: [],
    currentQuestion: null,
    questionIndex: 0,
    totalQuestions: 3,
    questionTimeLimit: 30000, // en milisegundos
    questionTime: 30, // en segundos para el frontend
    difficulty: 'MEDIUM',
    answersReceived: 0,
    totalPlayers: 0,
    timeRemaining: 0,
    gameStats: null,
    questionResults: null // Resultados de la pregunta actual
  });
  const [playerInfo, setPlayerInfo] = useState({
    id: null,
    name: null,
    isHost: false,
    score: 0,
    hasAnswered: false
  });

  // Efecto para inicializar la conexión Socket.IO
  useEffect(() => {
    // Solo crear la conexión si no existe y no se ha inicializado
    if (socketInitialized.current) {
      return;
    }

    console.log('🔌 Inicializando conexión Socket.IO...');
    socketInitialized.current = true;

    // Determinar URL del servidor
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.port === '3000';
    
    const SOCKET_URL = isDevelopment 
      ? 'http://localhost:3001' 
      : (process.env.REACT_APP_SERVER_URL || 'https://server-mi-biblioteca-personal.onrender.com');
    
    console.log('🔌 Socket.IO conectando a:', SOCKET_URL);

    // Conectar al servidor Socket.IO
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: false,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Limpiar event listeners previos
    newSocket.removeAllListeners();

    // Eventos de conexión
    newSocket.on('connect', () => {
      console.log('✅ Conectado al servidor');
      setIsConnected(true);
      toast.success('Conectado al servidor');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Desconectado del servidor:', reason);
      setIsConnected(false);
      setGameState(prev => ({ ...prev, status: 'disconnected' }));
      
      // Limpiar timer al desconectar
      if (questionTimerRef.current) {
        console.log('🧹 Limpiando timer por desconexión');
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
      
      if (reason !== 'io client disconnect') {
        toast.error('Desconectado del servidor');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error);
      toast.error('Error conectando al servidor');
    });

    // Eventos del juego
    newSocket.on('join_result', (data) => {
      console.log('📝 Resultado de unirse:', data);
      
      // Resetear la bandera de joining
      joiningRoom.current = false;
      
      if (data.success && data.gameState) {
        console.log('✅ Unión exitosa, actualizando estado:', {
          roomId: data.gameState.roomId,
          status: data.gameState.status,
          players: data.gameState.players?.length || 0
        });
        setGameState(prev => ({
          ...prev,
          roomId: data.gameState.roomId,
          status: data.gameState.status,
          players: data.gameState.players || [],
          totalQuestions: data.gameState.totalQuestions || 3,
          questionTimeLimit: data.gameState.questionTimeLimit || 30000,
          questionTime: data.gameState.questionTime || 30,
          difficulty: data.gameState.difficulty || 'MEDIUM'
        }));
        
        // Actualizar información del jugador - buscar por nombre ya que el ID aún no lo tenemos
        setPlayerInfo(prev => {
          const currentPlayer = data.gameState.players?.find(p => p.name === prev.name);
          if (currentPlayer) {
            console.log('✅ Jugador encontrado en lista:', currentPlayer);
            return {
              ...prev,
              id: currentPlayer.id, // ¡IMPORTANTE! Guardar el ID del jugador
              isHost: currentPlayer.isHost,
              score: currentPlayer.score
            };
          }
          console.log('⚠️ Jugador no encontrado en lista, usando datos previos');
          return prev;
        });
        
        // Solo mostrar toast si estamos en lobby
        if (window.location.pathname.includes('/trivia/lobby/')) {
          toast.success('Te has unido a la sala');
        }
      } else {
        console.error('❌ Error al unirse:', data.error);
        toast.error(data.error || 'Error al unirse a la sala');
      }
    });

    newSocket.on('player_joined', (data) => {
      console.log('👥 Jugador se unió:', data);
      setGameState(prev => ({
        ...prev,
        players: data.players,
        totalPlayers: data.players.length
      }));
      // Solo mostrar en lobby, no durante el juego
      if (window.location.pathname.includes('/trivia/lobby/')) {
        toast.success(`${data.playerName} se unió a la sala`);
      }
    });

    newSocket.on('player_left', (data) => {
      console.log('👋 Jugador se fue:', data);
      setGameState(prev => ({
        ...prev,
        players: data.players,
        totalPlayers: data.players.length
      }));
      // Solo mostrar en lobby, no durante el juego
      if (window.location.pathname.includes('/trivia/lobby/')) {
        toast(`${data.playerName} abandonó la sala`);
        
        if (data.newHost) {
          toast(`${data.newHost} es ahora el host`);
        }
      }
    });

    newSocket.on('game_started', (data) => {
      console.log('🎮 Juego iniciado:', data);
      setGameState(prev => ({
        ...prev,
        status: 'playing',
        questionIndex: 0,
        currentQuestion: data.gameState.currentQuestion,
        totalQuestions: data.gameState?.totalQuestions || prev.totalQuestions,
        questionTimeLimit: data.gameState?.questionTimeLimit || prev.questionTimeLimit,
        questionTime: data.gameState?.questionTime || prev.questionTime,
        difficulty: data.gameState?.difficulty || prev.difficulty
      }));
      // No mostrar toast durante el juego
    });

    newSocket.on('game_ended', (data) => {
      console.log('🏁 Juego terminado:', data);
      setGameState(prev => ({
        ...prev,
        status: 'finished',
        players: data.players,
        finalScores: data.finalScores
      }));
      // No mostrar toast durante el juego
    });

    newSocket.on('new_question', (data) => {
      console.log('❓ Nueva pregunta:', data);
      
      // Limpiar timer anterior antes de establecer nueva pregunta
      if (questionTimerRef.current) {
        console.log('🧹 Limpiando timer anterior por nueva pregunta');
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
      
      // Calcular tiempo inicial en segundos
      const initialTime = Math.ceil(data.question.timeLimit / 1000);
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: data.question,
        questionIndex: data.questionNumber,
        answersReceived: 0,
        timeRemaining: initialTime,
        questionResults: null // Limpiar resultados anteriores
      }));
      setPlayerInfo(prev => ({ ...prev, hasAnswered: false }));
      
      // Iniciar timer después de un pequeño delay para asegurar que el estado se actualizó
      // Usar setTimeout para asegurar que el estado se estableció correctamente
      setTimeout(() => {
        startQuestionTimer(data.question.timeLimit, initialTime);
      }, 50);
    });

    newSocket.on('answer_received', (data) => {
      console.log('✅ Respuesta recibida:', data);
      console.log(`⏰ Timer NO se modifica cuando alguien responde. Tiempo actual: ${gameState.timeRemaining} segundos`);
      
      // IMPORTANTE: NO modificar timeRemaining aquí. El timer debe seguir corriendo normalmente
      // hasta que todos respondan o el tiempo se agote.
      setGameState(prev => ({
        ...prev,
        answersReceived: data.answersReceived
        // NO modificar timeRemaining aquí - el timer debe seguir corriendo
      }));
      
      // Actualizar puntuación del jugador si es su respuesta
      if (data.playerName === playerInfo.name) {
        setPlayerInfo(prev => ({
          ...prev,
          score: prev.score + (data.points || 0),
          hasAnswered: true
        }));
      }
      
      // Actualizar puntuaciones de todos los jugadores
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(player => {
          if (player.name === data.playerName) {
            return { ...player, score: player.score + (data.points || 0) };
          }
          return player;
        })
      }));
    });

    newSocket.on('question_results', (data) => {
      console.log('📊 Resultados de pregunta:', data);
      
      // Limpiar timer cuando llegan los resultados (todos respondieron o tiempo expiró)
      if (questionTimerRef.current) {
        console.log('🧹 Limpiando timer por resultados de pregunta');
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
      
      // Establecer tiempo en 0 para indicar que la pregunta terminó
      setGameState(prev => ({
        ...prev,
        players: data.players,
        timeRemaining: 0, // La pregunta terminó
        questionResults: data // Guardar resultados para mostrar
      }));
      
      // Actualizar puntuación del jugador actual
      const currentPlayer = data.players.find(p => p.id === playerInfo.id);
      if (currentPlayer) {
        setPlayerInfo(prev => ({
          ...prev,
          score: currentPlayer.score
        }));
      }
    });

    newSocket.on('game_finished', (data) => {
      console.log('🏁 Juego terminado:', data);
      setGameState(prev => ({
        ...prev,
        status: 'finished',
        players: data.players,
        gameStats: data.gameStats
      }));
      
      // Navegar a la página de resultados
      setTimeout(() => {
        if (window.location.pathname.includes('/trivia/game/')) {
          const roomId = window.location.pathname.split('/trivia/game/')[1];
          window.location.href = `/trivia/results/${roomId}`;
        }
      }, 2000);
    });

    newSocket.on('error', (data) => {
      console.error('❌ Error del servidor:', data);
      toast.error(data.message || 'Error del servidor');
    });

    newSocket.on('total_questions_updated', (data) => {
      console.log('✅ Total de preguntas actualizado:', data);
      setGameState(prev => ({
        ...prev,
        totalQuestions: data.totalQuestions,
        ...(data.gameState && {
          questionTimeLimit: data.gameState.questionTimeLimit,
          questionTime: data.gameState.questionTime,
          difficulty: data.gameState.difficulty
        })
      }));
    });

    newSocket.on('question_time_updated', (data) => {
      console.log('✅ Tiempo por pregunta actualizado:', data);
      setGameState(prev => ({
        ...prev,
        questionTimeLimit: data.questionTimeLimit,
        questionTime: data.questionTime,
        ...(data.gameState && {
          totalQuestions: data.gameState.totalQuestions,
          difficulty: data.gameState.difficulty
        })
      }));
    });

    newSocket.on('difficulty_updated', (data) => {
      console.log('✅ Dificultad actualizada:', data);
      setGameState(prev => ({
        ...prev,
        difficulty: data.difficulty,
        ...(data.gameState && {
          totalQuestions: data.gameState.totalQuestions,
          questionTimeLimit: data.gameState.questionTimeLimit,
          questionTime: data.gameState.questionTime
        })
      }));
    });

    newSocket.on('game_state_updated', (data) => {
      console.log('📊 Número de preguntas actualizado:', data);
      setGameState(prev => ({
        ...prev,
        totalQuestions: data.totalQuestions,
        ...data.gameState
      }));
      toast.success(`Número de preguntas actualizado a ${data.totalQuestions}`);
    });

    setSocket(newSocket);

    // Cleanup - solo desconectar si realmente es necesario
    return () => {
      if (newSocket && newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Efecto para limpiar la conexión al desmontar
  useEffect(() => {
    return () => {
      // Solo limpiar si realmente estamos desmontando el componente
      if (socket && socket.connected) {
        console.log('🔌 Limpiando conexión Socket.IO...');
        socket.disconnect();
        socketInitialized.current = false;
      }
    };
  }, []);

  // Timer para las preguntas - Versión mejorada
  const startQuestionTimer = (timeLimit, initialTimeSeconds = null) => {
    console.log(`⏰ Iniciando timer del frontend: ${timeLimit}ms`);
    
    // Limpiar timer anterior si existe
    if (questionTimerRef.current) {
      console.log('🧹 Limpiando timer anterior');
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }

    // Usar el tiempo inicial proporcionado o calcularlo
    const initialTime = initialTimeSeconds !== null 
      ? initialTimeSeconds 
      : Math.ceil(timeLimit / 1000);
    
    console.log(`⏰ Timer inicial: ${initialTime} segundos`);

    // Asegurar que el tiempo inicial esté correcto
    setGameState(prev => {
      // Solo actualizar si el tiempo actual no coincide con el inicial
      if (prev.timeRemaining !== initialTime) {
        return {
          ...prev,
          timeRemaining: initialTime
        };
      }
      return prev;
    });

    // Crear nuevo timer
    const interval = setInterval(() => {
      setGameState(prev => {
        // Si el tiempo ya es 0 o menor, no hacer nada
        if (prev.timeRemaining <= 0) {
          return prev;
        }
        
        const newTime = prev.timeRemaining - 1;
        
        if (newTime <= 0) {
          console.log('⏰ Timer del frontend expirado');
          clearInterval(interval);
          questionTimerRef.current = null;
          return {
            ...prev,
            timeRemaining: 0
          };
        }
        
        console.log(`⏰ Timer: ${newTime} segundos restantes`);
        return {
          ...prev,
          timeRemaining: newTime
        };
      });
    }, 1000);

    questionTimerRef.current = interval;

    // Limpiar timer después del tiempo límite + buffer
    setTimeout(() => {
      console.log('🧹 Limpieza automática del timer');
      if (questionTimerRef.current === interval) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    }, timeLimit + 2000); // Buffer de 2 segundos
  };

  // Funciones para interactuar con el servidor
  const joinRoom = (roomId, userName) => {
    console.log('🏠 Intentando unirse a la sala:', { roomId, userName });
    
    // Evitar llamadas duplicadas
    if (joiningRoom.current) {
      console.log('⏳ Ya se está intentando unirse a una sala');
      return;
    }
    
    if (!socket) {
      console.error('❌ Socket no disponible');
      toast.error('No hay conexión con el servidor');
      return;
    }

    if (!isConnected) {
      console.error('❌ No conectado al servidor');
      toast.error('No hay conexión con el servidor');
      return;
    }

    joiningRoom.current = true;
    console.log('✅ Enviando evento join_room');
    setPlayerInfo(prev => ({ ...prev, name: userName }));
    socket.emit('join_room', { roomId, userName });
  };

  const startGame = (roomId) => {
    if (!socket || !isConnected) {
      toast.error('No hay conexión con el servidor');
      return;
    }

    socket.emit('start_game', { roomId });
  };

  const submitAnswer = (roomId, answer, timeSpent) => {
    if (!socket || !isConnected) {
      toast.error('No hay conexión con el servidor');
      return;
    }

    if (playerInfo.hasAnswered) {
      toast.error('Ya respondiste esta pregunta');
      return;
    }

    socket.emit('submit_answer', { roomId, answer, timeSpent });
  };

  const leaveRoom = (roomId) => {
    if (!socket || !isConnected) {
      return;
    }

    socket.emit('leave_room', { roomId });
    setGameState(prev => ({
      ...prev,
      roomId: null,
      status: 'disconnected',
      players: [],
      currentQuestion: null
    }));
    setPlayerInfo(prev => ({
      ...prev,
      id: null,
      name: null,
      isHost: false,
      score: 0,
      hasAnswered: false
    }));
  };

  const updateTotalQuestions = (roomId, totalQuestions) => {
    if (!socket || !isConnected) {
      toast.error('No hay conexión con el servidor');
      return;
    }

    // Permitir a cualquier jugador actualizar
    socket.emit('update_total_questions', { roomId, totalQuestions });
  };

  const updateQuestionTime = (roomId, questionTime) => {
    if (!socket || !isConnected) {
      toast.error('No hay conexión con el servidor');
      return;
    }

    // Permitir a cualquier jugador actualizar
    socket.emit('update_question_time', { roomId, questionTime });
  };

  const updateDifficulty = (roomId, difficulty) => {
    if (!socket || !isConnected) {
      toast.error('No hay conexión con el servidor');
      return;
    }

    // Permitir a cualquier jugador actualizar
    socket.emit('update_difficulty', { roomId, difficulty });
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  const value = {
    socket,
    isConnected,
    gameState,
    playerInfo,
    joinRoom,
    startGame,
    submitAnswer,
    leaveRoom,
    updateTotalQuestions,
    updateQuestionTime,
    updateDifficulty,
    disconnect,
    setGameState,
    setPlayerInfo
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
