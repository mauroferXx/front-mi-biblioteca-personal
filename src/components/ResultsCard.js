import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

const ResultsCard = ({ players, gameStats }) => {
  const getPositionStyle = (position) => {
    switch (position) {
      case 1:
        return {
          bg: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
          border: '2px solid #ffa500',
          icon: <Crown size={26} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />,
          iconBg: 'rgba(255, 215, 0, 0.3)',
          textColor: '#ffd700',
          shadowColor: 'rgba(255, 215, 0, 0.6)'
        };
      case 2:
        return {
          bg: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)',
          border: '2px solid #a8a8a8',
          icon: <Medal size={22} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />,
          iconBg: 'rgba(192, 192, 192, 0.3)',
          textColor: '#c0c0c0',
          shadowColor: 'rgba(192, 192, 192, 0.4)'
        };
      case 3:
        return {
          bg: 'linear-gradient(135deg, #cd7f32 0%, #e6a157 50%, #cd7f32 100%)',
          border: '2px solid #b87333',
          icon: <Award size={22} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />,
          iconBg: 'rgba(205, 127, 50, 0.3)',
          textColor: '#cd7f32',
          shadowColor: 'rgba(205, 127, 50, 0.4)'
        };
      default:
        return null;
    }
  };

  const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 1.5rem)' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 3.5vw, 2rem)' }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginBottom: '1rem' }}
        >
          <Trophy size={48} style={{ 
            margin: '0 auto', 
            color: '#ffd700',
            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))'
          }} />
        </motion.div>
        <h1 style={{ 
          fontSize: 'clamp(1.6rem, 6vw, 2.5rem)',
          fontWeight: '900',
          marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
          filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))'
        }}>
          ¡Juego Terminado!
        </h1>
        {gameStats && (
          <p style={{ 
            color: '#8b8b8b',
            fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Duración: {formatDuration(gameStats.duration)} • Preguntas: {gameStats.totalQuestions}
          </p>
        )}
      </motion.div>

      {/* Podio Top 3 */}
      {players.length > 0 && (
        <div style={{ marginBottom: 'clamp(1rem, 3.5vw, 2rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 'clamp(0.5rem, 3vw, 1rem)', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)', flexWrap: 'wrap' }}>
            {/* Segundo lugar */}
            {players[1] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: 'spring' }}
                style={{ flex: '0 0 auto', width: 'clamp(110px, 28vw, 140px)' }}
              >
                <div style={{
                  background: getPositionStyle(2).bg,
                  border: getPositionStyle(2).border,
                  borderRadius: '12px',
                  padding: 'clamp(0.75rem, 3vw, 1rem)',
                  textAlign: 'center',
                  height: 'clamp(140px, 34vw, 160px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: `0 8px 16px ${getPositionStyle(2).shadowColor}`
                }}>
                  <div style={{ 
                    background: getPositionStyle(2).iconBg,
                    width: 'clamp(40px, 10vw, 48px)',
                    height: 'clamp(40px, 10vw, 48px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto clamp(0.4rem, 2vw, 0.75rem)'
                  }}>
                    {getPositionStyle(2).icon}
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2.8vw, 0.95rem)', color: '#1f2937', marginBottom: '0.4rem' }}>
                    {players[1].name}
                  </div>
                  <div style={{ fontSize: 'clamp(1.2rem, 4.5vw, 1.4rem)', fontWeight: 'bold', color: getPositionStyle(2).textColor }}>
                    {players[1].score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>puntos</div>
                </div>
              </motion.div>
            )}

            {/* Primer lugar (más alto) */}
            {players[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                style={{ flex: '0 0 auto', width: 'clamp(120px, 30vw, 160px)' }}
              >
                <div style={{
                  background: getPositionStyle(1).bg,
                  border: getPositionStyle(1).border,
                  borderRadius: '12px',
                  padding: 'clamp(1rem, 3.5vw, 1.5rem)',
                  textAlign: 'center',
                  height: 'clamp(160px, 40vw, 200px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: `0 12px 24px ${getPositionStyle(1).shadowColor}`,
                  position: 'relative'
                }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ 
                      background: getPositionStyle(1).iconBg,
                      width: 'clamp(52px, 12vw, 64px)',
                      height: 'clamp(52px, 12vw, 64px)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto clamp(0.4rem, 2vw, 0.75rem)'
                    }}
                  >
                    {getPositionStyle(1).icon}
                  </motion.div>
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 3vw, 1.1rem)', color: '#1f2937', marginBottom: '0.5rem' }}>
                    {players[0].name}
                  </div>
                  <div style={{ fontSize: 'clamp(1.45rem, 5vw, 1.75rem)', fontWeight: 'bold', color: getPositionStyle(1).textColor }}>
                    {players[0].score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>puntos</div>
                </div>
              </motion.div>
            )}

            {/* Tercer lugar */}
            {players[2] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, type: 'spring' }}
                style={{ flex: '0 0 auto', width: 'clamp(110px, 28vw, 140px)' }}
              >
                <div style={{
                  background: getPositionStyle(3).bg,
                  border: getPositionStyle(3).border,
                  borderRadius: '12px',
                  padding: 'clamp(0.75rem, 3vw, 1rem)',
                  textAlign: 'center',
                  height: 'clamp(120px, 30vw, 140px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: `0 8px 16px ${getPositionStyle(3).shadowColor}`
                }}>
                  <div style={{ 
                    background: getPositionStyle(3).iconBg,
                    width: 'clamp(36px, 9vw, 44px)',
                    height: 'clamp(36px, 9vw, 44px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto clamp(0.4rem, 2vw, 0.75rem)'
                  }}>
                    {getPositionStyle(3).icon}
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2.6vw, 0.9rem)', color: '#1f2937', marginBottom: '0.4rem' }}>
                    {players[2].name}
                  </div>
                  <div style={{ fontSize: 'clamp(1.1rem, 4vw, 1.25rem)', fontWeight: 'bold', color: getPositionStyle(3).textColor }}>
                    {players[2].score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>puntos</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Resto de jugadores (si hay más de 3) */}
          {players.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{
                background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: 'clamp(1rem, 3.5vw, 1.5rem)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(199, 125, 255, 0.2)'
              }}
            >
              <h3 style={{ 
                fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', 
                fontWeight: '700', 
                color: '#c77dff', 
                marginBottom: 'clamp(0.5rem, 3vw, 1rem)', 
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Otros Jugadores
              </h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {players.slice(3).map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 3vw, 1rem)' }}>
                      <div style={{
                        width: 'clamp(32px, 9vw, 40px)',
                        height: 'clamp(32px, 9vw, 40px)',
                        borderRadius: '50%',
                        background: 'rgba(199, 125, 255, 0.2)',
                        border: '1px solid rgba(199, 125, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#c77dff',
                        fontWeight: 'bold',
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
                      }}>
                        #{player.position || (index + 4)}
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 3vw, 1rem)', color: '#ffffff' }}>
                        {player.name}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(1.1rem, 3.8vw, 1.25rem)', 
                      fontWeight: 'bold', 
                      color: '#00e6ff',
                      textShadow: '0 0 10px rgba(0, 230, 255, 0.5)'
                    }}>
                      {player.score.toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Mensaje de victoria/empate */}
      {players.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            background: gameStats && gameStats.isTie
              ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
            border: gameStats && gameStats.isTie
              ? '2px solid rgba(251, 191, 36, 0.4)'
              : '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: 'clamp(1rem, 4vw, 2rem)',
            textAlign: 'center',
            boxShadow: gameStats && gameStats.isTie
              ? '0 0 40px rgba(251, 191, 36, 0.3)'
              : '0 0 40px rgba(16, 185, 129, 0.3)',
            marginBottom: 'clamp(1rem, 3.5vw, 2rem)'
          }}
        >
          {gameStats && gameStats.isTie ? (
            <>
              <div style={{ 
                fontSize: 'clamp(1.6rem, 6vw, 2.5rem)', 
                fontWeight: '900', 
                color: '#fbbf24',
                marginBottom: 'clamp(0.5rem, 2.5vw, 1rem)',
                textShadow: '0 0 20px rgba(251, 191, 36, 0.8)'
              }}>
                🤝 ¡Empate!
              </div>
              <p style={{ 
                fontSize: 'clamp(1rem, 3.8vw, 1.2rem)', 
                color: '#e0e0e0',
                fontWeight: '600'
              }}>
                {gameStats.tiedPlayers} jugadores empataron con {players[0].score.toLocaleString()} puntos
              </p>
            </>
          ) : (
            <>
              <div style={{ 
                fontSize: 'clamp(1.6rem, 6vw, 2.5rem)', 
                fontWeight: '900', 
                color: '#10b981',
                marginBottom: 'clamp(0.5rem, 2.5vw, 1rem)',
                textShadow: '0 0 20px rgba(16, 185, 129, 0.8)'
              }}>
                🎉 ¡Felicitaciones {players[0].name}!
              </div>
              <p style={{ 
                fontSize: 'clamp(1rem, 3.8vw, 1.2rem)', 
                color: '#e0e0e0',
                fontWeight: '600'
              }}>
                Has ganado con {players[0].score.toLocaleString()} puntos
              </p>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResultsCard;
