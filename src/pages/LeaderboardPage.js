import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Medal, Award, Crown, Zap, BookOpen } from 'lucide-react';
import { libraryAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const leaderboardRes = await libraryAPI.getLeaderboard(100);
      setLeaderboard(leaderboardRes.leaderboard || []);
      
      // Cargar progreso del usuario actual
      if (user?.id) {
        const progressRes = await libraryAPI.getUserProgress(user.id);
        if (progressRes?.success) {
          setUserProgress(progressRes.user);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Error cargando la clasificación');
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown size={20} style={{ color: '#fbbf24' }} />;
      case 2:
        return <Medal size={18} style={{ color: '#9ca3af' }} />;
      case 3:
        return <Award size={18} style={{ color: '#cd7f32' }} />;
      default:
        return null;
    }
  };

  const getLevelColor = (level) => {
    if (level >= 75) return '#ef4444'; // Épico
    if (level >= 50) return '#f59e0b'; // Legendario
    if (level >= 25) return '#8b5cf6'; // Raro
    if (level >= 10) return '#3b82f6'; // Poco común
    return '#10b981'; // Común
  };

  if (loading) {
    return (
      <div className="min-h-full" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #e5e7eb',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
            <p className="text-gray-600" style={{ fontWeight: 600 }}>Cargando clasificación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p className="text-red-600 mb-4" style={{ fontWeight: 600 }}>{error}</p>
            <button 
              onClick={fetchData}
              className="btn btn-primary"
            >
              <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Encabezado */}
        <motion.div
          className="card card-border-left-blue"
          style={{ marginBottom: '2rem', padding: '1.5rem' }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Biblioteca | Clasificación</p>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Trophy className="w-7 h-7" color="#2563eb" />
                Clasificación Global
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Los lectores más avanzados. Compite, sube posiciones y presume tus logros.
              </p>
            </div>
            <button
              onClick={fetchData}
              className="btn"
              style={{ background: '#e5e7eb', color: '#4b5563', fontWeight: 600 }}
            >
              <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
              Actualizar
            </button>
          </div>
        </motion.div>

        {/* Tarjeta del Usuario Actual */}
        {userProgress && (
          <motion.div
            className="card card-border-top"
            style={{ marginBottom: '2rem', padding: '1.5rem', borderTopColor: '#3b82f6', borderTopWidth: '4px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Tu Progreso</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Nivel {userProgress.level}
                </h2>
                <p className="text-gray-600 mt-1">Posición #{userProgress.rank} en el ranking</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-sm text-gray-500">XP Total</div>
                <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
                  {userProgress.xp?.toLocaleString() || 0}
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="text-sm text-gray-600">{userProgress.progress.xpInCurrentLevel} XP</span>
                <span className="text-sm text-gray-600">{userProgress.progress.xpForNextLevel} XP</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '12px', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '6px', 
                overflow: 'hidden'
              }}>
                <motion.div 
                  style={{ 
                    width: `${userProgress.progress.percentage}%`, 
                    height: '100%', 
                    backgroundColor: '#3b82f6',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${userProgress.progress.percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Ranking */}
        {leaderboard.length === 0 ? (
          <motion.div
            className="card"
            style={{ padding: '3rem', textAlign: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Trophy size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No hay lectores aún</h3>
            <p className="text-gray-600">
              ¡Sé el primero en agregar libros y aparecer en el ranking!
            </p>
          </motion.div>
        ) : (
          <>
            {/* Top 3 - Podium */}
            {leaderboard.length >= 3 && (
              <motion.div
                className="grid-3"
                style={{ marginBottom: '2rem' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {leaderboard.slice(0, 3).map((reader, index) => {
                  const position = index + 1;
                  const levelColor = getLevelColor(reader.level);
                  const isCurrentUser = user?.id === reader.id;
                  
                  return (
                    <motion.div
                      key={reader.id}
                      className="card"
                      style={{ 
                        padding: '1.5rem',
                        borderTop: position === 1 ? '4px solid #fbbf24' : position === 2 ? '4px solid #9ca3af' : '4px solid #cd7f32',
                        position: 'relative',
                        border: isCurrentUser ? '2px solid #3b82f6' : '1px solid #e5e7eb'
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {isCurrentUser && (
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: '#3b82f6',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          Tú
                        </div>
                      )}
                      <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                        {getPositionIcon(position)}
                      </div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '1rem', 
                        color: '#1f2937',
                        marginBottom: '0.5rem',
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {reader.username}
                      </div>
                      <div style={{ 
                        fontSize: '1.5rem',
                        fontWeight: '900', 
                        color: levelColor,
                        marginBottom: '0.25rem',
                        textAlign: 'center'
                      }}>
                        Nv. {reader.level}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                        {reader.xp?.toLocaleString() || 0} XP
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Resto de lectores */}
            <motion.div
              className="card"
              style={{ padding: '1.5rem' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Ranking Completo</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {leaderboard.slice(3).map((reader, index) => {
                  const position = index + 4;
                  const levelColor = getLevelColor(reader.level);
                  const isCurrentUser = user?.id === reader.id;
                  
                  return (
                    <motion.div
                      key={reader.id}
                      style={{
                        background: isCurrentUser ? '#eff6ff' : '#ffffff',
                        border: isCurrentUser ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{
                          minWidth: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          #{position}
                        </div>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: levelColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          color: '#ffffff',
                          flexShrink: 0
                        }}>
                          {reader.username.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontWeight: '600', 
                            fontSize: '0.95rem', 
                            color: isCurrentUser ? '#3b82f6' : '#1f2937', 
                            marginBottom: '0.25rem', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            {reader.username}
                            {isCurrentUser && (
                              <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 500 }}>(Tú)</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <BookOpen size={12} />
                              <span>{reader.xp?.toLocaleString() || 0} XP</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          fontSize: '1.1rem', 
                          color: levelColor
                        }}>
                          Nv. {reader.level}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Estadísticas Globales */}
            <motion.div
              className="grid-3"
              style={{ marginTop: '2rem' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #fbbf24' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem' }}>
                  {leaderboard.reduce((sum, r) => sum + (r.xp || 0), 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>XP Total</div>
              </div>
              <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #10b981' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
                  {leaderboard.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Lectores</div>
              </div>
              <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #8b5cf6' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  {leaderboard.length > 0 ? Math.round(leaderboard.reduce((sum, r) => sum + (r.level || 1), 0) / leaderboard.length) : 0}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Nivel Promedio</div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
