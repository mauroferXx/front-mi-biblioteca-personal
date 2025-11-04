import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, ArrowLeft, Copy, Check, Clock, BookOpen, Target } from 'lucide-react';
import { useSocket } from '../services/SocketContext';
import toast from 'react-hot-toast';

const LobbyPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { joinRoom, startGame, leaveRoom, gameState, playerInfo, isConnected, updateTotalQuestions, updateQuestionTime, updateDifficulty } = useSocket();
  
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(null);
  
  const userName = searchParams.get('name');
  const isHost = searchParams.get('host') === 'true';

  useEffect(() => {
    if (userName && roomId && isConnected && !isJoining) {
      console.log('🏠 LobbyPage: Intentando unirse a la sala', { roomId, userName });
      setIsJoining(true);
      const timer = setTimeout(() => {
        joinRoom(roomId, userName);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userName, roomId, isConnected]);

  useEffect(() => {
    if (gameState.status === 'playing') {
      navigate(`/trivia/game/${roomId}`);
    }
  }, [gameState.status, navigate, roomId]);

  useEffect(() => {
    console.log('🏠 LobbyPage - Estado actualizado:', {
      roomId: gameState.roomId,
      status: gameState.status,
      players: gameState.players.length,
      isJoining
    });
    if (gameState.roomId && gameState.status === 'lobby') {
      console.log('✅ LobbyPage - Estado de lobby detectado, ocultando spinner');
      setIsJoining(false);
    }
  }, [gameState.roomId, gameState.status, gameState.players.length, isJoining]);

  // Cuenta regresiva cuando hay mínimo de jugadores
  useEffect(() => {
    if (gameState.players.length >= 2 && gameState.status === 'lobby') {
      // Iniciar cuenta regresiva de 15 segundos
      setCountdown(15);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            // Iniciar juego automáticamente cuando llegue a 0
            if (isHost && roomId) {
              console.log('⏰ Countdown terminado - Iniciando juego automáticamente');
              if (gameState.players.length >= 2) {
                startGame(roomId);
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown(null);
    }
  }, [gameState.players.length, gameState.status, isHost, roomId, startGame]);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoBack = () => {
    // Notificar al servidor que el jugador está abandonando la sala
    if (roomId) {
      leaveRoom(roomId);
    }
    navigate('/trivia');
  };

  if (isJoining) {
    return (
      <div className="min-h-full" style={{ 
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '8px',
            padding: '3rem 2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(199, 125, 255, 0.2)',
            textAlign: 'center'
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              border: '4px solid rgba(199, 125, 255, 0.2)',
              borderTopColor: '#c77dff',
              margin: '0 auto 1rem',
              boxShadow: '0 0 20px rgba(199, 125, 255, 0.4)'
            }}
          />
          <p style={{ color: '#c77dff', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>
            Uniéndose a la sala...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full" style={{ 
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)',
      minHeight: '100dvh',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto'
    }}>
      {/* Efectos de fondo estilo LOL */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'radial-gradient(circle at 20% 50%, rgba(199, 125, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 230, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div className="container" style={{ padding: '1rem', paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))', maxWidth: '1400px', position: 'relative', zIndex: 1 }}>
        {/* Botón volver */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '1rem' }}
        >
          <button 
            onClick={handleGoBack} 
            className="btn" 
            style={{ 
              background: 'rgba(0, 0, 0, 0.6)', 
              color: '#c77dff',
              border: '1px solid rgba(199, 125, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(199, 125, 255, 0.2)',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} />
            Salir
          </button>
        </motion.div>

        {/* Header: Código y Cuenta Regresiva */}
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Código de Sala */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              onClick={handleCopyRoomCode}
              style={{ 
                background: copied
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(199, 125, 255, 0.15) 0%, rgba(0, 230, 255, 0.15) 100%)',
                border: copied 
                  ? '2px solid rgba(16, 185, 129, 0.6)'
                  : '2px solid rgba(199, 125, 255, 0.4)',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                boxShadow: copied
                  ? 'inset 0 0 30px rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.4)'
                  : 'inset 0 0 30px rgba(199, 125, 255, 0.2), 0 0 20px rgba(199, 125, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ 
                color: copied ? '#10b981' : '#c77dff', 
                fontSize: '0.65rem', 
                marginBottom: '0.25rem', 
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {copied ? (
                  <>
                    <Check size={12} />
                    CÓDIGO COPIADO
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    CÓDIGO (CLICK PARA COPIAR)
                  </>
                )}
              </div>
              <div style={{ 
                color: copied ? '#10b981' : '#00e6ff', 
                fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', 
                fontWeight: '900', 
                letterSpacing: '0.2em',
                fontFamily: 'monospace',
                textShadow: copied 
                  ? '0 0 15px rgba(16, 185, 129, 0.8)'
                  : '0 0 15px rgba(0, 230, 255, 0.8)'
              }}>
                {roomId}
              </div>
            </motion.div>
          </div>

          {/* Cuenta Regresiva */}
          {countdown !== null && (
            <motion.div
              style={{
                background: countdown <= 5 
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
                border: countdown <= 5 
                  ? '2px solid rgba(239, 68, 68, 0.6)'
                  : '2px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                boxShadow: countdown <= 5
                  ? 'inset 0 0 30px rgba(239, 68, 68, 0.2), 0 0 30px rgba(239, 68, 68, 0.5)'
                  : 'inset 0 0 30px rgba(251, 191, 36, 0.2), 0 0 20px rgba(251, 191, 36, 0.3)',
                textAlign: 'center',
                margin: '0 auto',
                maxWidth: '200px'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div style={{ 
                color: countdown <= 5 ? '#ef4444' : '#fbbf24', 
                fontSize: '0.65rem', 
                marginBottom: '0.25rem', 
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}>
                {countdown <= 5 ? '¡INICIANDO!' : 'INICIANDO EN'}
              </div>
              <motion.div
                style={{ 
                  color: countdown <= 5 ? '#ef4444' : '#fbbf24', 
                  fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', 
                  fontWeight: '900',
                  fontFamily: 'monospace',
                  textShadow: countdown <= 5 
                    ? '0 0 20px rgba(239, 68, 68, 0.8)' 
                    : '0 0 20px rgba(251, 191, 36, 0.8)'
                }}
                animate={{ scale: countdown <= 5 ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 0.3, repeat: countdown <= 5 ? Infinity : 0 }}
              >
                {countdown}s
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Jugadores (Horizontal) */}
        <motion.div
          style={{
            background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(199, 125, 255, 0.2)',
            marginBottom: '1.5rem',
            minHeight: '200px',
            position: 'relative',
            overflow: 'hidden'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 style={{ 
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '1.25rem',
            color: '#c77dff',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textAlign: 'center'
          }}>
            Jugadores ({gameState.players.length}/10)
          </h3>

          <AnimatePresence>
            {gameState.players.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ 
                  textAlign: 'center', 
                  padding: '3rem 1rem',
                  color: '#6b6b6b'
                }}
              >
                <Users size={80} style={{ margin: '0 auto 1rem', opacity: 0.2, color: '#c77dff' }} />
                <p style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Esperando jugadores...</p>
              </motion.div>
            ) : (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                gap: 'clamp(1rem, 3vw, 2rem)',
                padding: '0.5rem'
              }}>
                {gameState.players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: -50 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      position: 'relative',
                      minWidth: '70px'
                    }}
                  >
                    {/* Avatar */}
          <motion.div
                      style={{
                        width: 'clamp(70px, 15vw, 100px)',
                        height: 'clamp(70px, 15vw, 100px)',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${
                          ['#c77dff', '#00e6ff', '#fbbf24', '#10b981', '#ef4444'][index % 5]
                        } 0%, ${
                          ['#9747ff', '#00b8d4', '#f59e0b', '#059669', '#dc2626'][index % 5]
                        } 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                        fontWeight: '900',
                        boxShadow: `0 8px 24px ${
                          ['rgba(199, 125, 255, 0.6)', 'rgba(0, 230, 255, 0.6)', 'rgba(251, 191, 36, 0.6)', 'rgba(16, 185, 129, 0.6)', 'rgba(239, 68, 68, 0.6)'][index % 5]
                        }`,
                        textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                        border: player.id === playerInfo.id ? '3px solid rgba(199, 125, 255, 0.8)' : '3px solid rgba(255, 255, 255, 0.1)',
                        position: 'relative'
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      {player.name.charAt(0).toUpperCase()}

                      {/* Badge "TÚ" */}
                      {player.id === playerInfo.id && (
                        <motion.div
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            left: '-8px',
                            background: 'linear-gradient(135deg, #c77dff, #00e6ff)',
                            color: 'white',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            letterSpacing: '0.05em',
                            boxShadow: '0 0 15px rgba(199, 125, 255, 0.8)'
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                        >
                          TÚ
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Nombre */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontWeight: '700', 
                        fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', 
                        color: '#ffffff',
                        textShadow: player.id === playerInfo.id ? '0 0 10px rgba(199, 125, 255, 0.8)' : 'none',
                        marginBottom: '0.15rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '120px'
                      }}>
                        {player.name}
                </div>
                      <div style={{ 
                        fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', 
                        color: '#8b8b8b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {player.isHost ? 'LÍDER' : 'MIEMBRO'}
                </div>
                </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info de la Partida */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div 
            style={{ 
              background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid rgba(199, 125, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              position: 'relative'
            }}
            whileHover={{ borderColor: 'rgba(199, 125, 255, 0.4)', boxShadow: '0 0 20px rgba(199, 125, 255, 0.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <BookOpen size={16} style={{ color: '#c77dff' }} />
              <span style={{ fontSize: '0.65rem', color: '#8b8b8b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Preguntas</span>
            </div>
            <select
              value={gameState.totalQuestions || 3}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                if (roomId && [3, 6, 9].includes(newValue)) {
                  updateTotalQuestions(roomId, newValue);
                }
              }}
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                fontWeight: '900',
                color: '#ffffff',
                background: 'transparent',
                border: '2px solid rgba(199, 125, 255, 0.4)',
                borderRadius: '6px',
                padding: '0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                textShadow: '0 0 10px rgba(199, 125, 255, 0.5)',
                width: '100%',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'rgba(199, 125, 255, 0.8)';
                e.target.style.boxShadow = '0 0 15px rgba(199, 125, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(199, 125, 255, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {[3, 6, 9].map(num => (
                <option key={num} value={num} style={{ background: '#1a1a2e', color: '#ffffff' }}>
                  {num}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            style={{ 
              background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid rgba(0, 230, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
            }}
            whileHover={{ borderColor: 'rgba(0, 230, 255, 0.4)', boxShadow: '0 0 20px rgba(0, 230, 255, 0.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <Users size={16} style={{ color: '#00e6ff' }} />
              <span style={{ fontSize: '0.65rem', color: '#8b8b8b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Jugadores</span>
                </div>
            <div style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '900', color: '#ffffff', textShadow: '0 0 10px rgba(0, 230, 255, 0.5)' }}>
              {gameState.players.length}
                        </div>
          </motion.div>

          <motion.div
            style={{ 
              background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
            }}
            whileHover={{ borderColor: 'rgba(251, 191, 36, 0.4)', boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <Clock size={16} style={{ color: '#fbbf24' }} />
              <span style={{ fontSize: '0.65rem', color: '#8b8b8b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Tiempo</span>
                    </div>
            <select
              value={gameState.questionTime || 30}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                if (roomId && [10, 20, 30, 60].includes(newValue)) {
                  updateQuestionTime(roomId, newValue);
                }
              }}
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                fontWeight: '900',
                color: '#ffffff',
                background: 'transparent',
                border: '2px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '6px',
                padding: '0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                width: '100%',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'rgba(251, 191, 36, 0.8)';
                e.target.style.boxShadow = '0 0 15px rgba(251, 191, 36, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(251, 191, 36, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {[10, 20, 30, 60].map(num => (
                <option key={num} value={num} style={{ background: '#1a1a2e', color: '#ffffff' }}>
                  {num}s
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div 
            style={{ 
              background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              position: 'relative'
            }}
            whileHover={{ borderColor: 'rgba(16, 185, 129, 0.4)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.65rem', color: '#8b8b8b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Dificultad</span>
            </div>
            <select
              value={gameState.difficulty || 'MEDIUM'}
              onChange={(e) => {
                const newValue = e.target.value;
                if (roomId && ['EASY', 'MEDIUM', 'HARD'].includes(newValue)) {
                  updateDifficulty(roomId, newValue);
                }
              }}
              style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                fontWeight: '900',
                color: '#ffffff',
                background: 'transparent',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '6px',
                padding: '0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                textShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                width: '100%',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'rgba(16, 185, 129, 0.8)';
                e.target.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="EASY" style={{ background: '#1a1a2e', color: '#ffffff' }}>FÁCIL</option>
              <option value="MEDIUM" style={{ background: '#1a1a2e', color: '#ffffff' }}>MEDIO</option>
              <option value="HARD" style={{ background: '#1a1a2e', color: '#ffffff' }}>DIFÍCIL</option>
            </select>
          </motion.div>
        </motion.div>

        {/* Mensaje informativo */}
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {gameState.players.length < 2 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ 
                background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '8px',
                padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 5vw, 3rem)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                textAlign: 'center',
                display: 'inline-block',
                maxWidth: '100%'
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Users size={60} style={{ color: '#ef4444', margin: '0 auto 1rem', filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.6))' }} />
              </motion.div>
              <p style={{ 
                color: '#ef4444', 
                fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', 
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: '1.6'
              }}>
                Esperando jugadores...<br />
                <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#8b8b8b' }}>Mínimo 2 jugadores</span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              style={{ 
                background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '8px',
                padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 5vw, 3rem)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                border: '2px solid rgba(199, 125, 255, 0.4)',
                textAlign: 'center',
                display: 'inline-block',
                maxWidth: '100%'
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                <Play size={60} style={{ color: '#c77dff', margin: '0 auto 1rem', filter: 'drop-shadow(0 0 20px rgba(199, 125, 255, 0.6))' }} />
              </motion.div>
              <p style={{ 
                color: '#c77dff', 
                fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', 
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: '1.6',
                marginBottom: '0.5rem'
              }}>
                ¡Listos para jugar!
              </p>
              <p style={{ 
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', 
                color: '#8b8b8b',
                fontWeight: '500'
              }}>
                El juego iniciará automáticamente
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LobbyPage;
