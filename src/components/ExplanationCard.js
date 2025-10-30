import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';

const ExplanationCard = ({ answerResult }) => {
  if (!answerResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ 
        background: answerResult.isCorrect 
          ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%), linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.3) 100%), linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: answerResult.isCorrect
          ? '0 8px 32px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 8px 32px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        border: answerResult.isCorrect
          ? '2px solid rgba(16, 185, 129, 0.4)'
          : '2px solid rgba(239, 68, 68, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glow effect de fondo */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '200%',
        background: answerResult.isCorrect
          ? 'radial-gradient(ellipse, rgba(16, 185, 129, 0.2) 0%, transparent 50%)'
          : 'radial-gradient(ellipse, rgba(239, 68, 68, 0.2) 0%, transparent 50%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ 
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {answerResult.isCorrect ? (
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              padding: '1.5rem',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)',
              border: '3px solid rgba(16, 185, 129, 0.3)'
            }}>
              <CheckCircle size={80} style={{ color: 'white', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '50%',
              padding: '1.5rem',
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)',
              border: '3px solid rgba(239, 68, 68, 0.3)'
            }}>
              <XCircle size={80} style={{ color: 'white', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
            </div>
          )}
        </motion.div>

        <motion.h2
          style={{ 
            fontSize: '3rem',
            fontWeight: '900',
            marginBottom: '2rem',
            color: answerResult.isCorrect ? '#10b981' : '#ef4444',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textShadow: answerResult.isCorrect
              ? '0 0 30px rgba(16, 185, 129, 0.8)'
              : '0 0 30px rgba(239, 68, 68, 0.8)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {answerResult.isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
        </motion.h2>

        <motion.div
          style={{
            background: answerResult.isCorrect
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
            padding: '1.5rem 2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            border: answerResult.isCorrect
              ? '1px solid rgba(16, 185, 129, 0.3)'
              : '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: answerResult.isCorrect
              ? 'inset 0 0 20px rgba(16, 185, 129, 0.1)'
              : 'inset 0 0 20px rgba(239, 68, 68, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            marginBottom: '1rem'
          }}>
            <Lightbulb size={28} style={{ 
              color: answerResult.isCorrect ? '#10b981' : '#ef4444',
              filter: 'drop-shadow(0 0 10px ' + (answerResult.isCorrect ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)') + ')'
            }} />
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Respuesta Correcta
            </h3>
          </div>
          <p style={{ 
            fontSize: '1.3rem', 
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.6'
          }}>
            <span style={{ 
              color: answerResult.isCorrect ? '#10b981' : '#ef4444',
              fontSize: '1.5rem',
              fontWeight: '900'
            }}>
              {answerResult.correctAnswer}
            </span>
            {': '}
            {answerResult.correctAnswerText}
          </p>
        </motion.div>

        {answerResult.explanation && (
          <motion.div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1.5rem 2rem',
              borderRadius: '12px',
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: '#e0e0e0',
              border: '1px solid rgba(199, 125, 255, 0.2)',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#c77dff'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#c77dff',
                boxShadow: '0 0 10px rgba(199, 125, 255, 0.6)'
              }} />
              <span style={{ 
                fontSize: '0.85rem', 
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Explicación
              </span>
            </div>
            <p style={{ fontWeight: 500 }}>{answerResult.explanation}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ExplanationCard;

