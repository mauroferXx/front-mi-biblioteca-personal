import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Trophy, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <motion.a 
            href="/" 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="logo-icon">
              <Brain size={20} />
            </div>
            Trivia Game
          </motion.a>
          
          <nav className="nav">
            <a href="/" className="nav-link">
              <Users size={16} />
              Inicio
            </a>
            <a href="/leaderboard" className="nav-link">
              <Trophy size={16} />
              Ranking
            </a>
            <a href="#" className="nav-link">
              <Settings size={16} />
              Configuración
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
