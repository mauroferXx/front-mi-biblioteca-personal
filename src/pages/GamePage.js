import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useSocket } from '../services/SocketContext';
import QuestionCard from '../components/QuestionCard';
import ResultsCard from '../components/ResultsCard';
import QuestionResults from '../components/QuestionResults';
import ExplanationCard from '../components/ExplanationCard';

const GamePage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { 
    gameState, 
    playerInfo, 
    submitAnswer, 
    leaveRoom,
    isConnected 
  } = useSocket();

  // Fases del juego: 'question' | 'answer_reveal' | 'explanation' | 'rankings'
  const [gamePhase, setGamePhase] = useState('question');
  const [answerResult, setAnswerResult] = useState(null); // { isCorrect, correctAnswer, correctAnswerText }

  useEffect(() => {
    if (!isConnected) {
      navigate('/trivia');
      return;
    }

    if (gameState.status === 'finished') {
      navigate(`/trivia/results/${roomId}`);
      return;
    }

    if (gameState.status === 'lobby') {
      navigate(`/trivia/lobby/${roomId}`);
      return;
    }
  }, [gameState.status, isConnected, navigate, roomId]);

  // Resetear fase cuando cambia la pregunta
  useEffect(() => {
    if (gameState.currentQuestion) {
      setGamePhase('question');
      setAnswerResult(null);
    }
  }, [gameState.questionIndex, gameState.currentQuestion]);

  // Manejar transiciones de fases cuando llegan los resultados
  useEffect(() => {
    if (gameState.questionResults && gamePhase === 'question') {
      // Fase 1: Revelar respuesta correcta/incorrecta (2 segundos)
      const currentPlayer = gameState.questionResults.players.find(p => p.id === playerInfo.id);
      
      const newAnswerResult = {
        isCorrect: currentPlayer ? currentPlayer.isCorrect : false,
        correctAnswer: gameState.questionResults.correctAnswer,
        correctAnswerText: gameState.questionResults.correctAnswerText,
        explanation: gameState.questionResults.explanation || null
      };
      setAnswerResult(newAnswerResult);
      setGamePhase('answer_reveal');

      // Fase 2: Mostrar explicación (si existe) después de 2 segundos
      setTimeout(() => {
        if (newAnswerResult.explanation) {
          setGamePhase('explanation');
          // Fase 3: Mostrar rankings después de 6.5 segundos (tiempo para leer explicación)
          setTimeout(() => {
            setGamePhase('rankings');
          }, 6500);
        } else {
          // Si no hay explicación, ir directo a rankings después de 2 segundos
          setTimeout(() => {
            setGamePhase('rankings');
          }, 2000);
        }
      }, 2000);
    }
  }, [gameState.questionResults, gamePhase, playerInfo.id]);

  const handleAnswer = (answer, timeSpent) => {
    submitAnswer(roomId, answer, timeSpent);
  };

  const handleGoBack = () => {
    // Notificar al servidor que el jugador está abandonando la sala
    if (roomId) {
      leaveRoom(roomId);
    }
    navigate('/trivia');
  };

  if (gameState.status === 'finished') {
    return (
      <div className="min-h-full" style={{ 
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem'
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
        
        <div className="container" style={{ maxWidth: '960px', position: 'relative', zIndex: 1 }}>
          <ResultsCard 
            players={gameState.players} 
            gameStats={gameState.gameStats}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full" style={{ 
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
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

      <div className="container" style={{ maxWidth: '1120px', position: 'relative', zIndex: 1, marginTop: '5rem' }}>
        {/* Contenido principal - Ancho completo */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Pregunta principal - FASE: question y answer_reveal */}
          {(gamePhase === 'question' || gamePhase === 'answer_reveal') && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <QuestionCard
                question={gameState.currentQuestion}
                timeRemaining={gameState.timeRemaining}
                onAnswer={handleAnswer}
                hasAnswered={playerInfo.hasAnswered}
                questionNumber={gameState.questionIndex}
                totalQuestions={gameState.totalQuestions}
                answerResult={answerResult}
                showReveal={gamePhase === 'answer_reveal'}
              />
            </motion.div>
          )}

          {/* Explicación - FASE: explanation */}
          {gamePhase === 'explanation' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ExplanationCard answerResult={answerResult} />
            </motion.div>
          )}

          {/* Rankings - FASE: rankings */}
          {gamePhase === 'rankings' && gameState.questionResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <QuestionResults 
                results={gameState.questionResults} 
                playerInfo={playerInfo} 
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
