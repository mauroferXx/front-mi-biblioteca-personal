import React from 'react';
import { motion } from 'framer-motion';
import { Medal, Award, Crown } from 'lucide-react';

const QuestionResults = ({ results, playerInfo }) => {
  if (!results) return null;

  const getPositionStyle = (position) => {
    switch (position) {
      case 1:
        return {
          bg: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
          border: '3px solid #ffa500',
          icon: <Crown size={28} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />,
          iconBg: 'rgba(255, 215, 0, 0.3)',
          textColor: '#b8860b'
        };
      case 2:
        return {
          bg: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)',
          border: '3px solid #a8a8a8',
          icon: <Medal size={24} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />,
          iconBg: 'rgba(192, 192, 192, 0.3)',
          textColor: '#696969'
        };
      case 3:
        return {
          bg: 'linear-gradient(135deg, #cd7f32 0%, #e6a157 50%, #cd7f32 100%)',
          border: '3px solid #b87333',
          icon: <Award size={24} style={{ color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />,
          iconBg: 'rgba(205, 127, 50, 0.3)',
          textColor: '#8b4513'
        };
      default:
        return null;
    }
  };

  const renderTopThree = () => {
    const topThree = results.players.slice(0, 3);
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 'clamp(0.5rem, 3vw, 1rem)', marginBottom: 'clamp(1rem, 3.5vw, 2rem)', flexWrap: 'wrap' }}>
        {/* Segundo lugar (izquierda) */}
        {topThree[1] && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            style={{ flex: '0 0 auto', width: 'clamp(110px, 28vw, 140px)' }}
          >
            <div style={{
              background: getPositionStyle(2).bg,
              border: getPositionStyle(2).border,
              borderRadius: '16px',
              padding: '1rem',
              textAlign: 'center',
              height: 'clamp(140px, 34vw, 160px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              position: 'relative',
              transform: topThree[1].id === playerInfo.id ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s'
            }}>
              <div style={{ 
                background: getPositionStyle(2).iconBg,
                width: 'clamp(40px, 10vw, 50px)',
                height: 'clamp(40px, 10vw, 50px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem'
              }}>
                {getPositionStyle(2).icon}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', color: '#1f2937', marginBottom: '0.25rem' }}>
                {topThree[1].name}
              </div>
              <div style={{ fontSize: 'clamp(1.1rem, 4vw, 1.25rem)', fontWeight: 'bold', color: getPositionStyle(2).textColor }}>
                {topThree[1].score.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>puntos</div>
              {topThree[1].id === playerInfo.id && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#3b82f6',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  TÚ
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Primer lugar (centro, más alto) */}
        {topThree[0] && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
            style={{ flex: '0 0 auto', width: 'clamp(120px, 30vw, 160px)' }}
          >
            <div style={{
              background: getPositionStyle(1).bg,
              border: getPositionStyle(1).border,
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center',
              height: 'clamp(160px, 40vw, 200px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(255, 215, 0, 0.4)',
              position: 'relative',
              transform: topThree[0].id === playerInfo.id ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.3s'
            }}>
              <div style={{ 
                background: getPositionStyle(1).iconBg,
                width: 'clamp(48px, 12vw, 60px)',
                height: 'clamp(48px, 12vw, 60px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem',
                animation: 'pulse 2s infinite'
              }}>
                {getPositionStyle(1).icon}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 3vw, 1.1rem)', color: '#1f2937', marginBottom: '0.25rem' }}>
                {topThree[0].name}
              </div>
              <div style={{ fontSize: 'clamp(1.4rem, 5vw, 1.75rem)', fontWeight: 'bold', color: getPositionStyle(1).textColor }}>
                {topThree[0].score.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>puntos</div>
              {topThree[0].id === playerInfo.id && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#3b82f6',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  TÚ
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tercer lugar (derecha) */}
        {topThree[2] && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
            style={{ flex: '0 0 auto', width: 'clamp(110px, 28vw, 140px)' }}
          >
            <div style={{
              background: getPositionStyle(3).bg,
              border: getPositionStyle(3).border,
              borderRadius: '16px',
              padding: '1rem',
              textAlign: 'center',
              height: 'clamp(120px, 30vw, 140px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              position: 'relative',
              transform: topThree[2].id === playerInfo.id ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s'
            }}>
              <div style={{ 
                background: getPositionStyle(3).iconBg,
                width: 'clamp(36px, 9vw, 45px)',
                height: 'clamp(36px, 9vw, 45px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem'
              }}>
                {getPositionStyle(3).icon}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.8rem, 2.3vw, 0.85rem)', color: '#1f2937', marginBottom: '0.25rem' }}>
                {topThree[2].name}
              </div>
              <div style={{ fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', fontWeight: 'bold', color: getPositionStyle(3).textColor }}>
                {topThree[2].score.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>puntos</div>
              {topThree[2].id === playerInfo.id && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#3b82f6',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  TÚ
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderRestOfPlayers = () => {
    if (results.players.length <= 3) return null;

    return (
      <div style={{ marginTop: 'clamp(1rem, 3.5vw, 2rem)' }}>
        <h3 style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: '700', color: '#c77dff', marginBottom: '0.75rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Otros Jugadores
        </h3>
        <div className="space-y-2">
          {results.players.slice(3).map((player, index) => (
            <motion.div
              key={player.id}
              className="flex items-center justify-between p-3 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              style={{ 
                background: player.id === playerInfo.id 
                  ? 'linear-gradient(90deg, rgba(199, 125, 255, 0.2) 0%, rgba(0, 230, 255, 0.15) 100%)'
                  : 'rgba(0, 0, 0, 0.3)',
                border: player.id === playerInfo.id 
                  ? '1px solid rgba(199, 125, 255, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: player.id === playerInfo.id 
                  ? '0 4px 8px rgba(199, 125, 255, 0.3)' 
                  : 'none'
              }}
            >
              <div className="flex items-center gap-3">
                <div style={{ 
                  minWidth: 'clamp(28px, 8vw, 32px)',
                  height: 'clamp(28px, 8vw, 32px)',
                  borderRadius: '50%',
                  background: 'rgba(199, 125, 255, 0.2)',
                  border: '1px solid rgba(199, 125, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                  color: '#c77dff'
                }}>
                  #{player.position}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ fontSize: 'clamp(0.9rem, 3vw, 0.95rem)', color: '#ffffff' }}>{player.name}</span>
                    {player.id === playerInfo.id && (
                      <span className="text-xs text-white px-2 py-0.5 rounded font-medium" style={{ 
                        background: 'linear-gradient(135deg, #c77dff, #00e6ff)',
                        boxShadow: '0 0 10px rgba(199, 125, 255, 0.5)'
                      }}>TÚ</span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: '#8b8b8b' }}>
                    {player.isCorrect ? (
                      <span style={{ color: '#10b981' }}>✓ Correcta</span>
                    ) : player.lastAnswer ? (
                      <span style={{ color: '#ef4444' }}>✗ Incorrecta</span>
                    ) : (
                      <span>Sin responder</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', color: '#00e6ff', textShadow: '0 0 10px rgba(0, 230, 255, 0.5)' }}>
                  {player.score.toLocaleString()}
                </div>
                <div className="text-xs" style={{ color: '#8b8b8b' }}>pts</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ 
        padding: 'clamp(1rem, 4vw, 2rem)', 
        background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(199, 125, 255, 0.2)'
      }}
    >
      {/* Encabezado */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #c77dff 0%, #00e6ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(199, 125, 255, 0.5)',
            filter: 'drop-shadow(0 0 10px rgba(199, 125, 255, 0.5))'
          }}>
            🏆 Clasificación
          </h2>
        </motion.div>
        <p style={{ color: '#8b8b8b', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)' }}>
          Pregunta {results.questionNumber} de {results.totalQuestions}
        </p>
      </div>

      {/* Podio (Top 3) */}
      {renderTopThree()}

      {/* Resto de jugadores */}
      {renderRestOfPlayers()}

      {/* Estadísticas de la pregunta */}
      <motion.div 
        style={{ 
          borderTop: '2px solid rgba(199, 125, 255, 0.2)', 
          paddingTop: 'clamp(0.75rem, 3.5vw, 1.5rem)', 
          marginTop: 'clamp(1rem, 3.5vw, 2rem)' 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.1)'
          }}>
            <div className="text-2xl font-bold" style={{ color: '#10b981', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>
              {results.questionStats.correctAnswers}
            </div>
            <div className="text-sm" style={{ color: '#10b981', fontWeight: '600' }}>Acertaron</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0, 230, 255, 0.2) 0%, rgba(0, 184, 212, 0.15) 100%)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 230, 255, 0.3)',
            boxShadow: 'inset 0 0 20px rgba(0, 230, 255, 0.1)'
          }}>
            <div className="text-2xl font-bold" style={{ color: '#00e6ff', textShadow: '0 0 10px rgba(0, 230, 255, 0.5)' }}>
              {results.questionStats.totalAnswered}
            </div>
            <div className="text-sm" style={{ color: '#00e6ff', fontWeight: '600' }}>Respondieron</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(199, 125, 255, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(199, 125, 255, 0.3)',
            boxShadow: 'inset 0 0 20px rgba(199, 125, 255, 0.1)'
          }}>
            <div className="text-2xl font-bold" style={{ color: '#c77dff', textShadow: '0 0 10px rgba(199, 125, 255, 0.5)' }}>
              {results.totalQuestions - results.questionNumber}
            </div>
            <div className="text-sm" style={{ color: '#c77dff', fontWeight: '600' }}>Restantes</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuestionResults;
