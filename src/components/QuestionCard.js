import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const QuestionCard = ({ 
  question, 
  timeRemaining, 
  onAnswer, 
  hasAnswered, 
  questionNumber, 
  totalQuestions,
  answerResult = null, // { isCorrect, correctAnswer, correctAnswerText }
  showReveal = false // Si debe mostrar el reveal de respuesta correcta/incorrecta
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // Resetear estado cuando cambia la pregunta
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResults(false);
    setCorrectAnswer(null);
  }, [questionNumber]);

  // Actualizar cuando llega el reveal de respuesta
  useEffect(() => {
    if (showReveal && answerResult) {
      setCorrectAnswer(answerResult.correctAnswer);
      setShowResults(true);
    }
  }, [showReveal, answerResult]);

  useEffect(() => {
    if (timeRemaining <= 0 && !hasAnswered) {
      // Tiempo agotado
      setShowResults(true);
    }
  }, [timeRemaining, hasAnswered]);

  const handleAnswerClick = (answer) => {
    if (hasAnswered || timeRemaining <= 0 || showReveal) return;
    
    setSelectedAnswer(answer);
    const timeSpent = (30 - timeRemaining) * 1000; // Convertir a milisegundos
    onAnswer(answer, timeSpent);
  };

  // Guardar respuesta del jugador actual cuando answerResult llega
  useEffect(() => {
    if (answerResult && !selectedAnswer) {
      // Si no tenemos selectedAnswer pero tenemos result, buscar en localStorage o usar último
      const lastAnswer = localStorage.getItem(`lastAnswer_${questionNumber}`);
      if (lastAnswer) {
        setSelectedAnswer(lastAnswer);
      }
    }
  }, [answerResult, selectedAnswer, questionNumber]);

  // Guardar respuesta cuando se envía
  useEffect(() => {
    if (selectedAnswer && hasAnswered) {
      localStorage.setItem(`lastAnswer_${questionNumber}`, selectedAnswer);
    }
  }, [selectedAnswer, hasAnswered, questionNumber]);

  const getOptionClass = (option) => {
    // Si estamos en modo reveal, mostrar correcta/incorrecta
    if (showReveal && showResults) {
      if (option === correctAnswer) return 'correct';
      if (selectedAnswer === option && option !== correctAnswer) return 'incorrect';
      return '';
    }
    
    // Modo normal: solo resaltar selección
    if (!hasAnswered) {
      return selectedAnswer === option ? 'selected' : '';
    }
    
    // Ya respondió pero sin reveal, mantener selección
    return selectedAnswer === option ? 'selected' : '';
  };

  const getOptionIcon = (option) => {
    // Solo mostrar íconos en modo reveal
    if (!showReveal || !showResults) return null;
    
    if (option === correctAnswer) {
      return <CheckCircle size={24} className="text-white" />;
    }
    
    if (selectedAnswer === option && option !== correctAnswer) {
      return <XCircle size={24} className="text-white" />;
    }
    
    return null;
  };

  if (!question) {
    return (
      <div style={{
        background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: '3rem 2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(199, 125, 255, 0.2)',
        textAlign: 'center'
      }}>
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
        <p style={{ color: '#c77dff', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Esperando siguiente pregunta...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      style={{
        background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: 'clamp(1rem, 4vw, 2rem)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(199, 125, 255, 0.2)',
        position: 'relative'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header con timer y número de pregunta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(1rem, 3vw, 2rem)', gap: '0.75rem' }}>
        <div style={{ 
          color: '#c77dff', 
          fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', 
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Pregunta {questionNumber} de {totalQuestions}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: timeRemaining <= 10 
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(0, 230, 255, 0.2) 0%, rgba(0, 184, 212, 0.2) 100%)',
            border: timeRemaining <= 10 ? '2px solid #ef4444' : '2px solid #00e6ff',
            borderRadius: '50%',
            width: 'clamp(44px, 10vw, 56px)',
            height: 'clamp(44px, 10vw, 56px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: timeRemaining <= 10 ? '#ef4444' : '#00e6ff',
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            fontWeight: '900',
            boxShadow: timeRemaining <= 10 
              ? '0 0 20px rgba(239, 68, 68, 0.5)'
              : '0 0 20px rgba(0, 230, 255, 0.3)',
            animation: timeRemaining <= 10 ? 'pulse 1s infinite' : 'none'
          }}>
            {timeRemaining}
          </div>
          <span style={{ 
            color: '#8b8b8b', 
            fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            seg
          </span>
        </div>
      </div>

      {/* Texto de la pregunta */}
      <div style={{ 
        color: '#ffffff',
        fontSize: 'clamp(1.1rem, 4.5vw, 1.5rem)',
        fontWeight: '700',
        marginBottom: 'clamp(1rem, 3.5vw, 2rem)',
        lineHeight: '1.4',
        textAlign: 'center',
        padding: 'clamp(0.5rem, 3vw, 1rem)'
      }}>
        {question.text}
      </div>

      {/* Opciones */}
      <div style={{ display: 'grid', gap: 'clamp(0.5rem, 3vw, 1rem)' }}>
        {question.options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
          const optionClass = getOptionClass(optionLetter);
          
          let bgColor = 'rgba(0, 0, 0, 0.3)';
          let borderColor = 'rgba(199, 125, 255, 0.2)';
          let textColor = '#ffffff';
          let boxShadow = 'none';
          
          if (optionClass === 'correct') {
            bgColor = 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)';
            borderColor = '#10b981';
            boxShadow = '0 0 30px rgba(16, 185, 129, 0.5)';
          } else if (optionClass === 'incorrect') {
            bgColor = 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)';
            borderColor = '#ef4444';
            boxShadow = '0 0 30px rgba(239, 68, 68, 0.5)';
          } else if (optionClass === 'selected') {
            bgColor = 'linear-gradient(135deg, rgba(199, 125, 255, 0.2) 0%, rgba(0, 230, 255, 0.2) 100%)';
            borderColor = '#c77dff';
            boxShadow = '0 0 20px rgba(199, 125, 255, 0.3)';
          }
          
          return (
            <motion.button
              key={index}
              onClick={() => handleAnswerClick(optionLetter)}
              disabled={hasAnswered || timeRemaining <= 0}
              whileHover={!hasAnswered && timeRemaining > 0 ? { 
                scale: 1.02,
                boxShadow: '0 0 30px rgba(199, 125, 255, 0.4)'
              } : {}}
              whileTap={!hasAnswered && timeRemaining > 0 ? { scale: 0.98 } : {}}
              style={{
                background: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: '8px',
                padding: 'clamp(0.75rem, 3.5vw, 1.25rem) clamp(1rem, 4vw, 1.5rem)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.5rem, 3vw, 1rem)',
                cursor: (hasAnswered || timeRemaining <= 0) ? 'not-allowed' : 'pointer',
                color: textColor,
                fontSize: 'clamp(0.95rem, 3.2vw, 1.05rem)',
                fontWeight: '600',
                textAlign: 'left',
                boxShadow,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: 'clamp(32px, 9vw, 40px)',
                height: 'clamp(32px, 9vw, 40px)',
                borderRadius: '8px',
                background: optionClass === 'correct' ? '#10b981' 
                  : optionClass === 'incorrect' ? '#ef4444'
                  : optionClass === 'selected' ? '#c77dff'
                  : 'rgba(199, 125, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
                fontWeight: '900',
                color: optionClass ? '#ffffff' : '#c77dff',
                flexShrink: 0,
                boxShadow: optionClass === 'correct' ? '0 0 15px rgba(16, 185, 129, 0.5)'
                  : optionClass === 'incorrect' ? '0 0 15px rgba(239, 68, 68, 0.5)'
                  : optionClass === 'selected' ? '0 0 15px rgba(199, 125, 255, 0.5)'
                  : 'none'
              }}>
                {optionLetter}
              </div>
              <div style={{ flex: 1 }}>
                {option}
              </div>
              {getOptionIcon(optionLetter)}
            </motion.button>
          );
        })}
      </div>

      {/* Mensajes de estado */}
      {hasAnswered && !showReveal && (
        <motion.div
          style={{ 
            marginTop: '1.5rem', 
            textAlign: 'center', 
            color: '#00e6ff',
            fontWeight: '700',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '1rem',
            background: 'rgba(0, 230, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 230, 255, 0.3)'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ✓ Respuesta enviada
        </motion.div>
      )}

      {timeRemaining <= 0 && !hasAnswered && (
        <motion.div
          style={{ 
            marginTop: '1.5rem', 
            textAlign: 'center', 
            color: '#ef4444',
            fontWeight: '700',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⏰ Tiempo agotado
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
