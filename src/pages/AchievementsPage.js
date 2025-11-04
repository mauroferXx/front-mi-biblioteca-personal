import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Lock, Trophy, BookOpen, Brain, Zap, Clock } from 'lucide-react';
import { libraryAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';
import toast from 'react-hot-toast';

const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchAchievements();
      // Verificar logros al cargar la página
      checkAchievements();
    }
  }, [user?.id]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await libraryAPI.getAchievements(user.id);
      if (res?.success) {
        setAchievements(res.achievements);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Error cargando logros');
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = async () => {
    try {
      const res = await libraryAPI.checkAchievements(user.id);
      if (res?.success && res.unlocked.length > 0) {
        // Recargar logros
        await fetchAchievements();
        // Mostrar notificaciones de logros desbloqueados
        res.unlocked.forEach(achievement => {
          toast.success(`🏆 ¡Logro desbloqueado! ${achievement.achievement.name}`, { duration: 5000 });
        });
      }
    } catch (err) {
      console.error('Error checking achievements:', err);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return '1px solid #e5e7eb';
      case 'rare': return '2px solid #3b82f6';
      case 'epic': return '2px solid #8b5cf6';
      case 'legendary': return '2px solid #f59e0b';
      default: return '1px solid #e5e7eb';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Bienvenida': return <Trophy size={16} />;
      case 'Biblioteca': return <BookOpen size={16} />;
      case 'Lectura': return <BookOpen size={16} />;
      case 'Nivel y XP': return <Zap size={16} />;
      case 'Trivia': return <Brain size={16} />;
      case 'Hábito y Tiempo': return <Clock size={16} />;
      default: return <Award size={16} />;
    }
  };

  const groupByCategory = (achievements) => {
    return achievements.reduce((acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(achievement);
      return acc;
    }, {});
  };

  const getUnlockedCount = () => {
    return achievements.filter(a => a.unlocked).length;
  };

  const getTotalCount = () => {
    return achievements.length;
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
            <p className="text-gray-600" style={{ fontWeight: 600 }}>Cargando logros...</p>
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
              onClick={fetchAchievements}
              className="btn btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groupedAchievements = groupByCategory(achievements);
  const unlockedCount = getUnlockedCount();
  const totalCount = getTotalCount();
  const progressPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

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
          <p className="text-xs text-gray-500 font-semibold uppercase">Biblioteca | Logros</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award className="w-7 h-7" color="#2563eb" />
            Logros
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Descubre y desbloquea logros mientras exploras la biblioteca y compites en trivias.
          </p>
          
          {/* Progreso */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-sm text-gray-600">Progreso Total</span>
              <span className="text-sm font-bold" style={{ color: '#3b82f6' }}>
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px', 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${progressPercentage}%`, 
                height: '100%', 
                backgroundColor: '#3b82f6',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progressPercentage}% completado</p>
          </div>
        </motion.div>

        {/* Logros por categoría */}
        {Object.entries(groupedAchievements).map(([category, categoryAchievements], categoryIndex) => (
          <motion.div
            key={category}
            className="card"
            style={{ marginBottom: '2rem', padding: '1.5rem' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {getCategoryIcon(category)}
              <h2 className="text-xl font-bold text-gray-800">{category}</h2>
              <span className="text-sm text-gray-500">
                ({categoryAchievements.filter(a => a.unlocked).length} / {categoryAchievements.length})
              </span>
            </div>

            <div className="grid-3">
              {categoryAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className="card"
                  style={{
                    padding: '1rem',
                    border: getRarityBorder(achievement.rarity),
                    background: achievement.unlocked ? '#ffffff' : '#f9fafb',
                    opacity: achievement.unlocked ? 1 : 0.6,
                    position: 'relative'
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: achievement.unlocked ? 1 : 0.6, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {achievement.unlocked && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      color: '#10b981'
                    }}>
                      <CheckCircle size={20} />
                    </div>
                  )}
                  
                  {!achievement.unlocked && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      color: '#9ca3af'
                    }}>
                      <Lock size={20} />
                    </div>
                  )}

                  <div style={{ marginBottom: '0.75rem' }}>
                    <Award 
                      size={32} 
                      style={{ 
                        color: achievement.unlocked ? getRarityColor(achievement.rarity) : '#d1d5db'
                      }} 
                    />
                  </div>

                  <h3 className="text-base font-bold text-gray-800 mb-1" style={{ 
                    color: achievement.unlocked ? '#1f2937' : '#9ca3af'
                  }}>
                    {achievement.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2" style={{ 
                    color: achievement.unlocked ? '#6b7280' : '#9ca3af'
                  }}>
                    {achievement.description}
                  </p>

                  <div style={{ 
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: achievement.unlocked 
                      ? `${getRarityColor(achievement.rarity)}20`
                      : '#e5e7eb',
                    color: achievement.unlocked 
                      ? getRarityColor(achievement.rarity)
                      : '#9ca3af'
                  }}>
                    {achievement.rarity}
                  </div>

                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
