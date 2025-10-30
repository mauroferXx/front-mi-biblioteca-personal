import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, RefreshCw } from 'lucide-react';
import { useSocket } from '../services/SocketContext';
import ResultsCard from '../components/ResultsCard';

const ResultsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { gameState, playerInfo, leaveRoom } = useSocket();

  const handleGoHome = () => {
    // Notificar al servidor que el jugador está abandonando la sala
    if (roomId) {
      leaveRoom(roomId);
    }
    navigate('/trivia');
  };

  const handlePlayAgain = () => {
    navigate(`/trivia/lobby/${roomId}?name=${encodeURIComponent(playerInfo.name)}&host=true`);
  };

  const handleViewLeaderboard = () => {
    navigate('/trivia/leaderboard');
  };

  return (
    <div style={{
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      padding: '1.5rem'
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

      {/* Botón Salir - Flotante arriba a la izquierda */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{ 
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 9999
        }}
      >
        <button 
          onClick={handleGoHome} 
          className="btn" 
          style={{ 
            background: 'rgba(0, 0, 0, 0.9)', 
            color: '#c77dff',
            border: '1px solid rgba(199, 125, 255, 0.4)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(199, 125, 255, 0.5)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(199, 125, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowLeft size={18} />
          Salir
        </button>
      </motion.div>

      <div style={{ maxWidth: '1120px', margin: '0 auto', position: 'relative', zIndex: 1, marginTop: '4rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* ResultsCard */}
          <ResultsCard 
            players={gameState.players || []} 
            gameStats={gameState.gameStats}
          />

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              marginTop: '2rem',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={handlePlayAgain}
              style={{
                background: 'linear-gradient(135deg, #c77dff 0%, #00e6ff 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 8px 24px rgba(199, 125, 255, 0.4)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(199, 125, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(199, 125, 255, 0.4)';
              }}
            >
              <RefreshCw size={20} />
              Jugar de Nuevo
            </button>

            <button
              onClick={handleViewLeaderboard}
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#00e6ff',
                border: '2px solid rgba(0, 230, 255, 0.4)',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 24px rgba(0, 230, 255, 0.3)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 230, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(0, 230, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 230, 255, 0.3)';
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
              }}
            >
              <Trophy size={20} />
              Ver Clasificación
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
