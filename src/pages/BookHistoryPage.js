import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, TrendingUp, FileText, Brain } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { libraryAPI } from '../services/api';
import { toast } from 'react-hot-toast';

// Función para obtener XP por estado (misma lógica que el backend)
const getXPForStatus = (status) => {
  const xpValues = {
    'TO_READ': 5,
    'READING': 10,
    'READ': 50,
    'COMPLETED': 25
  };
  return xpValues[status] || 0;
};

const BookHistoryPage = () => {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [xpDetails, setXpDetails] = useState([]);
  const [userLibrary, setUserLibrary] = useState([]);

  const targetUserId = paramUserId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadHistory();
      loadUserInfo();
      loadUserLibrary();
    }
  }, [targetUserId]);

  const loadHistory = async () => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      const res = await libraryAPI.getHistory(targetUserId);
      if (res?.success) {
        setHistory(res.history || []);
      } else {
        toast.error(res?.error || 'Error cargando historial');
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      toast.error('Error cargando historial');
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async () => {
    if (!targetUserId) return;
    try {
      const res = await libraryAPI.getUserProgress(targetUserId);
      if (res?.success) {
        setUserInfo(res.user);
      }
    } catch (error) {
      console.error('Error cargando información del usuario:', error);
    }
  };

  const loadUserLibrary = async () => {
    if (!targetUserId) return;
    try {
      const res = await libraryAPI.getUserLibrary(targetUserId);
      if (res?.success) {
        setUserLibrary(res.items || []);
      }
    } catch (error) {
      console.error('Error cargando biblioteca del usuario:', error);
    }
  };

  const handleRecalculateXP = async () => {
    if (!targetUserId) return;
    if (!window.confirm('¿Estás seguro de recalcular el XP? Esto actualizará el XP basado en el historial y estado actual de los libros.')) {
      return;
    }
    
    setRecalculating(true);
    try {
      const res = await libraryAPI.recalculateXP(targetUserId);
      if (res?.success) {
        // Guardar los detalles del XP para mostrarlos
        setXpDetails(res.xpDetails || []);
        toast.success(`✅ XP recalculado! Nuevo XP: ${res.newXP}, Nivel: ${res.newLevel}`);
        await loadUserInfo();
        window.dispatchEvent(new Event('xp-updated'));
      } else {
        toast.error(res?.error || 'Error recalculando XP');
      }
    } catch (error) {
      console.error('Error recalculando XP:', error);
      toast.error('Error recalculando XP');
    } finally {
      setRecalculating(false);
    }
  };

  // Obtener información del libro desde el historial o la biblioteca
  const getBookInfo = (bookId) => {
    // Primero intentar desde el historial
    const historyItem = history.find(h => h.bookId === bookId);
    if (historyItem && historyItem.bookTitle) {
      return {
        title: historyItem.bookTitle || 'Libro sin título',
        author: historyItem.bookAuthor || 'Autor desconocido'
      };
    }
    
    // Si no está en el historial, buscar en la biblioteca del usuario
    const libraryItem = userLibrary.find(lib => lib.bookId === bookId || lib.book?.id === bookId);
    if (libraryItem) {
      return {
        title: libraryItem.book?.title || 'Libro sin título',
        author: libraryItem.book?.author || 'Autor desconocido'
      };
    }
    
    // Si no se encuentra, devolver un título genérico con el ID
    return {
      title: `Libro (${bookId.substring(0, 10)}...)`,
      author: 'Información no disponible'
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TO_READ': return '#f59e0b';
      case 'READING': return '#3b82f6';
      case 'READ': return '#10b981';
      case 'COMPLETED': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'TO_READ': return 'Por leer';
      case 'READING': return 'Leyendo';
      case 'READ': return 'Leído';
      case 'COMPLETED': return 'Completado';
      default: return status || 'N/A';
    }
  };


  return (
    <div className="min-h-full" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Header */}
        <motion.div
          className="card card-border-left-blue"
          style={{ marginBottom: '2rem', padding: '1.5rem' }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Historial | Validación</p>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText className="w-7 h-7" color="#2563eb" />
                Historial de Libros
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Revisa el historial completo de cambios de estado de tus libros y valida la experiencia ganada.
              </p>
            </div>
            
            {userInfo && (
              <div style={{ 
                padding: '1rem', 
                background: '#f9fafb', 
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                minWidth: '200px'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Estado Actual</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>
                  Nivel {userInfo.level}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {userInfo.xp} XP
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              Volver
            </button>
            <button
              onClick={loadHistory}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={16} />
              Actualizar
            </button>
            <button
              onClick={handleRecalculateXP}
              disabled={recalculating}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <TrendingUp size={16} />
              {recalculating ? 'Recalculando...' : 'Recalcular XP'}
            </button>
          </div>
        </motion.div>

        {/* Desglose de XP */}
        {(xpDetails.length > 0 || history.length > 0) && (
          <motion.div
            className="card"
            style={{ marginBottom: '2rem', padding: '1.5rem' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} />
              Desglose de Experiencia
            </h2>
            
            {xpDetails.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Agrupar detalles por libro */}
                {Object.entries(
                  xpDetails.reduce((acc, detail) => {
                    // Trivias tienen bookId null, agruparlas por tipo
                    const key = detail.bookId || 'TRIVIA';
                    if (!acc[key]) {
                      acc[key] = [];
                    }
                    acc[key].push(detail);
                    return acc;
                  }, {})
                ).map(([bookId, details]) => {
                  // Si es trivia, mostrar diferente
                  if (bookId === 'TRIVIA') {
                    const totalTriviaXP = details.reduce((sum, d) => sum + d.xp, 0);
                    return (
                      <div
                        key={bookId}
                        style={{
                          padding: '1rem',
                          background: '#f0f9ff',
                          borderRadius: '8px',
                          border: '1px solid #3b82f6'
                        }}
                      >
                        <div style={{ marginBottom: '0.75rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Brain size={16} />
                            Trivias
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            Experiencia ganada en partidas de trivia
                          </p>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {details[0]?.triviaDetails?.map((triviaDetail, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem',
                                background: 'white',
                                borderRadius: '4px'
                              }}
                            >
                              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {triviaDetail.reason}
                              </span>
                              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
                                +{triviaDetail.xp} XP
                              </span>
                            </div>
                          ))}
                          
                          <div
                            style={{
                              marginTop: '0.5rem',
                              paddingTop: '0.5rem',
                              borderTop: '1px solid #e5e7eb',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontWeight: '600',
                              color: '#374151'
                            }}
                          >
                            <span>Total por trivias:</span>
                            <span style={{ color: '#2563eb' }}>{totalTriviaXP} XP</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Para libros
                  const bookInfo = getBookInfo(bookId);
                  const totalBookXP = details.reduce((sum, d) => sum + d.xp, 0);
                  
                  return (
                    <div
                      key={bookId}
                      style={{
                        padding: '1rem',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div style={{ marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                          {bookInfo.title}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {bookInfo.author}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {details.map((detail, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.5rem',
                              background: 'white',
                              borderRadius: '4px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  background: getStatusColor(detail.status) + '20',
                                  color: getStatusColor(detail.status)
                                }}
                              >
                                {getStatusLabel(detail.status)}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {detail.reason}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
                              +{detail.xp} XP
                            </span>
                          </div>
                        ))}
                        
                        <div
                          style={{
                            marginTop: '0.5rem',
                            paddingTop: '0.5rem',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontWeight: '600',
                            color: '#374151'
                          }}
                        >
                          <span>Total por libro:</span>
                          <span style={{ color: '#2563eb' }}>{totalBookXP} XP</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '8px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  <span>Total de Experiencia:</span>
                  <span>{xpDetails.reduce((sum, d) => sum + d.xp, 0)} XP</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                <p>Haz clic en "Recalcular XP" para ver el desglose de experiencia ganada.</p>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default BookHistoryPage;

