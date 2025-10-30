import React from 'react';
import { motion } from 'framer-motion';
import { User, Crown, Clock, CheckCircle, Users } from 'lucide-react';

const PlayerCard = ({ player, isCurrentPlayer = false }) => {
  const getStatusIcon = () => {
    if (player.hasAnswered) {
      return <CheckCircle size={16} className="text-green-500" />;
    }
    return <Clock size={16} className="text-gray-400" />;
  };

  return (
    <motion.div
      className={`player-item ${isCurrentPlayer ? 'ring-2 ring-blue-500' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="player-info">
        <div className="player-avatar">
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="player-name">
            {player.name}
            {player.isHost && <Crown size={14} className="text-yellow-500 ml-1" />}
            {isCurrentPlayer && <User size={14} className="text-blue-500 ml-1" />}
          </div>
          <div className="player-status">
            {getStatusIcon()}
            <span>
              {player.hasAnswered ? 'Respondió' : 'Esperando'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="player-score">
        {player.score.toLocaleString()} pts
      </div>
    </motion.div>
  );
};

const PlayersList = ({ players, currentPlayerId }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users size={20} />
        Jugadores ({players.length})
      </h3>
      
      <div className="players-list">
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            isCurrentPlayer={player.id === currentPlayerId}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
