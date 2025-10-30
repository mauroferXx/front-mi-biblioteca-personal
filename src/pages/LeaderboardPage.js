import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, RefreshCw, ArrowLeft, Medal, Award, Crown } from 'lucide-react';
import { gameAPI } from '../services/api';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await gameAPI.getLeaderboard(20);
      setLeaderboard(data.leaderboard || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Error cargando el ranking');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/trivia');
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown size={20} style={{ color: '#ffd700', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))' }} />;
      case 2:
        return <Medal size={18} style={{ color: '#c0c0c0', filter: 'drop-shadow(0 0 8px rgba(192, 192, 192, 0.6))' }} />;
      case 3:
        return <Award size={18} style={{ color: '#cd7f32', filter: 'drop-shadow(0 0 8px rgba(205, 127, 50, 0.6))' }} />;
      default:
        return null;
    }
  };

  const getPositionStyle = (position) => {
    switch (position) {
      case 1:
        return {
          bg: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 237, 78, 0.1) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.4)',
          textColor: '#ffd700'
        };
      case 2:
        return {
          bg: 'linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(232, 232, 232, 0.1) 100%)',
          border: '1px solid rgba(192, 192, 192, 0.4)',
          textColor: '#c0c0c0'
        };
      case 3:
        return {
          bg: 'linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(230, 161, 87, 0.1) 100%)',
          border: '1px solid rgba(205, 127, 50, 0.4)',
          textColor: '#cd7f32'
        };
      default:
        return {
          bg: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(199, 125, 255, 0.2)',
          textColor: '#c77dff'
        };
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
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
          <p style={{ color: '#c77dff', fontSize: '1rem', fontWeight: '600' }}>Cargando ranking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>{error}</div>
          <button 
            onClick={fetchLeaderboard}
            style={{
              background: 'linear-gradient(135deg, #c77dff 0%, #00e6ff 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(199, 125, 255, 0.4)'
            }}
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
          onClick={handleGoBack} 
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
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ marginBottom: '1rem' }}
            >
              <Trophy size={56} style={{ 
                margin: '0 auto', 
                color: '#ffd700',
                filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))'
              }} />
            </motion.div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '900',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))'
            }}>
              Ranking Global
            </h1>
            <p style={{ color: '#8b8b8b', fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem' }}>
              Los mejores jugadores de Trivia
            </p>
            <button
              onClick={fetchLeaderboard}
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#00e6ff',
                border: '2px solid rgba(0, 230, 255, 0.4)',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px rgba(0, 230, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 230, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(0, 230, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 230, 255, 0.3)';
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
              }}
            >
              <RefreshCw size={16} />
              Actualizar
            </button>
          </motion.div>

          {/* Lista de jugadores */}
          {leaderboard.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                border: '1px solid rgba(199, 125, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)'
              }}
            >
              <Trophy size={64} style={{ color: 'rgba(199, 125, 255, 0.3)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                No hay datos aún
              </h3>
              <p style={{ color: '#8b8b8b' }}>
                ¡Sé el primero en jugar y aparecer en el ranking!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(199, 125, 255, 0.2)'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {leaderboard.slice(0, 3).map((player, index) => {
                  const position = index + 1;
                  const style = getPositionStyle(position);
                  return (
                    <motion.div
                      key={player.player_name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      style={{
                        flex: position === 1 ? '1.2' : '1',
                        background: style.bg,
                        border: style.border,
                        borderRadius: '8px',
                        padding: position === 1 ? '1.25rem 1rem' : '1rem 0.75rem',
                        textAlign: 'center',
                        boxShadow: position === 1 ? '0 8px 24px rgba(255, 215, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem' }}>
                        {getPositionIcon(position)}
                      </div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: position === 1 ? '1rem' : '0.9rem', 
                        color: '#ffffff',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {player.player_name}
                      </div>
                      <div style={{ 
                        fontSize: position === 1 ? '1.5rem' : '1.25rem',
                        fontWeight: 'bold', 
                        color: style.textColor,
                        textShadow: `0 0 10px ${style.textColor}`
                      }}>
                        {player.total_score.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#8b8b8b' }}>puntos</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Resto de jugadores */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {leaderboard.slice(3).map((player, index) => {
                  const position = index + 4;
                  const style = getPositionStyle(position);
                  return (
                    <motion.div
                      key={player.player_name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      style={{
                        background: style.bg,
                        border: style.border,
                        borderRadius: '8px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{
                          minWidth: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(199, 125, 255, 0.2)',
                          border: '1px solid rgba(199, 125, 255, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          color: '#c77dff'
                        }}>
                          #{position}
                        </div>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #c77dff 0%, #00e6ff 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          color: '#ffffff',
                          flexShrink: 0
                        }}>
                          {player.player_name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {player.player_name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#8b8b8b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Users size={12} />
                              <span>{player.total_games}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Trophy size={12} />
                              <span>{player.games_won}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#00e6ff', textShadow: '0 0 10px rgba(0, 230, 255, 0.5)' }}>
                          {player.total_score.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#8b8b8b' }}>pts</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Estadísticas */}
              <div style={{
                borderTop: '2px solid rgba(199, 125, 255, 0.2)',
                paddingTop: '1.5rem',
                marginTop: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(0, 230, 255, 0.2) 0%, rgba(0, 184, 212, 0.15) 100%)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 230, 255, 0.3)'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00e6ff', textShadow: '0 0 10px rgba(0, 230, 255, 0.5)' }}>
                    {leaderboard.reduce((sum, p) => sum + p.total_games, 0)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#00e6ff', fontWeight: '600' }}>Juegos</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>
                    {leaderboard.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>Jugadores</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(199, 125, 255, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(199, 125, 255, 0.3)'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c77dff', textShadow: '0 0 10px rgba(199, 125, 255, 0.5)' }}>
                    {Math.round(leaderboard.reduce((sum, p) => sum + p.average_score, 0) / leaderboard.length)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#c77dff', fontWeight: '600' }}>Promedio</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
