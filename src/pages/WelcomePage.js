import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Trophy } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Encabezado de bienvenida */}
        <motion.div
          className="card card-border-left-blue"
          style={{ marginBottom: '2rem', padding: '1.5rem' }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs text-gray-500 font-semibold uppercase">Biblioteca | Usuario</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen className="w-7 h-7" color="#2563eb" />
            Bienvenido/a
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Tu centro de aprendizaje y entretenimiento. Explora módulos educativos y desafía tu conocimiento con experiencias interactivas.
          </p>
        </motion.div>

        {/* Secciones de Contenido */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          {/* Card 1: Trivia Interactiva */}
          <motion.div
            className="card"
            style={{ padding: '1.5rem', borderTop: '4px solid #6366f1' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Brain className="w-5 h-5" color="#4f46e5" />
              <h3 className="text-xl font-bold text-gray-800">Trivia Interactiva</h3>
            </div>
            <p className="text-gray-500 text-sm" style={{ marginBottom: '1rem' }}>
              Pon a prueba tus conocimientos en partidas multijugador en tiempo real.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => navigate('/trivia')}
                className="btn btn-primary"
              >
                Explorar
              </button>
              <span className="text-xs" style={{ color: '#f59e0b', fontWeight: 600 }}>Disponible</span>
            </div>
          </motion.div>

          {/* Card 2: Biblioteca Digital */}
          <motion.div
            className="card"
            style={{ padding: '1.5rem', borderTop: '4px solid #10b981' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <BookOpen className="w-5 h-5" color="#10b981" />
              <h3 className="text-xl font-bold text-gray-800">Biblioteca Digital</h3>
            </div>
            <p className="text-gray-500 text-sm" style={{ marginBottom: '1rem' }}>
              Explora una colección de libros y recursos educativos seleccionados.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => navigate('/library')} className="btn" style={{ background: '#e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                Explorar
              </button>
              <span className="text-xs" style={{ color: '#16a34a', fontWeight: 600 }}>Beta</span>
            </div>
          </motion.div>

          {/* Card 3: Clasificaciones */}
          <motion.div
            className="card"
            style={{ padding: '1.5rem', borderTop: '4px solid #ef4444' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Trophy className="w-5 h-5" color="#ef4444" />
              <h3 className="text-xl font-bold text-gray-800">Clasificaciones</h3>
            </div>
            <p className="text-gray-500 text-sm" style={{ marginBottom: '1rem' }}>
              Compite, sube posiciones y presume tus logros en el ranking.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="btn" style={{ background: '#e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                Ver Ranking
              </button>
              <span className="text-xs" style={{ color: '#f59e0b', fontWeight: 600 }}>Próximamente</span>
            </div>
          </motion.div>
        </div>

        {/* Llamada a la Acción Final */}
        <motion.div
          className="card card-border-top"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">¿Listo para comenzar?</h3>
          <p className="text-gray-600 mb-4">
            Empieza con nuestra trivia interactiva y pon a prueba tus conocimientos. Juega solo o con amigos en tiempo real.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="sm:flex-row">
            <button
              onClick={() => navigate('/trivia')}
              className="btn btn-primary"
              style={{ borderRadius: '9999px' }}
            >
              Jugar Trivia
            </button>
            <button
              className="btn"
              style={{ background: '#f3f4f6', color: '#374151', fontWeight: 600, borderRadius: '9999px' }}
            >
              Ver Novedades
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;

