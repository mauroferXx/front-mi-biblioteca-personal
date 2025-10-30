import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Trophy, Brain, Zap } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { libraryAPI } from '../services/api';

const TriviaHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [myLibrary, setMyLibrary] = useState([]);
  const [loadingLib, setLoadingLib] = useState(false);

  const openPicker = async () => {
    if (!user?.id) {
      alert('Inicia sesión para usar tu biblioteca');
      return;
    }
    setShowPicker(true);
    setLoadingLib(true);
    try {
      const res = await libraryAPI.getUserLibrary(user.id);
      setMyLibrary(res.items || []);
    } catch (_) {
      setMyLibrary([]);
    } finally {
      setLoadingLib(false);
    }
  };

  const startBookRoom = (book) => {
    if (!user?.username) {
      alert('Usuario no disponible');
      return;
    }
    const roomId = `BOOK_${book.book.id}`;
    setShowPicker(false);
    navigate(`/trivia/lobby/${roomId}?name=${encodeURIComponent(user.username)}&host=true`);
  };

  const handleCreateRoom = () => {
    if (!user?.username) {
      alert('Usuario no disponible');
      return;
    }
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/trivia/lobby/${newRoomCode}?name=${encodeURIComponent(user.username)}&host=true`);
  };

  const handleJoinRoom = () => {
    if (!user?.username) {
      alert('Usuario no disponible');
      return;
    }
    if (!roomCode.trim()) {
      alert('Por favor ingresa el código de sala');
      return;
    }
    navigate(`/trivia/lobby/${roomCode.toUpperCase()}?name=${encodeURIComponent(user.username)}`);
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <motion.div
            className="text-center"
            style={{ marginBottom: '3rem' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '5rem', height: '5rem', borderRadius: '1rem', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
                <Brain size={40} color="#fff" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900" style={{ marginBottom: '0.5rem' }}>Trivia Game</h1>
            <p className="text-lg text-gray-600">Compite en tiempo real con otros jugadores</p>
          </motion.div>

          <div className="grid-2" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {/* Crear Sala */}
            <motion.div
              className="card card-border-top-green"
              style={{ padding: '2rem' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center" style={{ marginBottom: '1.25rem' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#22c55e,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-md)' }}>
                  <Play size={24} color="#fff" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Crear Sala</h2>
                <p className="text-gray-600">Crea una nueva sala y espera a que otros jugadores se unan</p>
              </div>

              <div className="space-y-4">
                <button
                  className="btn"
                  onClick={openPicker}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#eef2ff', color: '#3730a3', fontWeight: 600 }}
                >
                  <Brain size={16} /> Jugar Trivia por libro de mi biblioteca
                </button>
              </div>
            </motion.div>

            {/* Unirse a Sala */}
            <motion.div
              className="card card-border-top-indigo"
              style={{ padding: '2rem' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center" style={{ marginBottom: '1.25rem' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-md)' }}>
                  <Users size={24} color="#fff" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Unirse a Sala</h2>
                <p className="text-gray-600">Únete a una sala existente con el código de la sala</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '0.5rem' }}>Código de sala</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Ej: ABC123 o BOOK_123456"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={32}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleJoinRoom}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Users size={16} />
                  Unirse a Sala
                </button>
              </div>
            </motion.div>
          </div>

          {/* Características */}
          <motion.div
            className="text-center"
            style={{ marginTop: '4rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '2rem' }}>¿Por qué elegir nuestro juego?</h3>
            <div className="grid-3" style={{ maxWidth: '960px', margin: '0 auto' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg,#f59e0b,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-md)' }}>
                  <Zap size={24} color="#fff" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '0.5rem' }}>Tiempo Real</h4>
                <p className="text-gray-600">Compite en tiempo real con otros jugadores</p>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-md)' }}>
                  <Brain size={24} color="#fff" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '0.5rem' }}>Preguntas Variadas</h4>
                <p className="text-gray-600">Múltiples categorías y niveles de dificultad</p>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg,#22c55e,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-md)' }}>
                  <Trophy size={24} color="#fff" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '0.5rem' }}>Sistema de Puntuación</h4>
                <p className="text-gray-600">Gana puntos por velocidad y precisión</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center', zIndex: 100 }} onClick={() => setShowPicker(false)}>
          <div className="card" style={{ width: '100%', maxWidth: 720, padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold" style={{ marginBottom: '0.5rem' }}>Elige un libro de tu biblioteca</h3>
            {loadingLib ? (
              <div className="text-sm text-gray-500">Cargando...</div>
            ) : (
              <div className="list" style={{ display: 'grid', gap: '0.5rem', maxHeight: '60vh', overflow: 'auto' }}>
                {myLibrary.map((item) => (
                  <div key={item.bookId} className="list-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={item.book.coverUrl || 'https://via.placeholder.com/40x60?text=No+Cover'} alt={item.book.title} width={40} height={60} style={{ borderRadius: 4, objectFit: 'cover' }} />
                      <div>
                        <div className="font-medium">{item.book.title}</div>
                        <div className="text-sm text-gray-600">{item.book.author}</div>
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => startBookRoom(item)}>Jugar</button>
                  </div>
                ))}
                {!myLibrary.length && <div className="text-sm text-gray-500">No tienes libros en tu biblioteca</div>}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowPicker(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaHomePage;

