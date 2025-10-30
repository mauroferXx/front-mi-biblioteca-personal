import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useUIStore } from '../../stores/useUIStore';

const Layout = ({ children }) => {
  const location = useLocation();
  const { setActiveView, setPageTitle, closeSidebar } = useUIStore();

  // Detectar si estamos en modo juego (pantalla completa sin header)
  const isGameMode = location.pathname.includes('/trivia/lobby/') || 
                     location.pathname.includes('/trivia/game/') || 
                     location.pathname.includes('/trivia/results/') ||
                     location.pathname.includes('/trivia/leaderboard');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveView('home');
      setPageTitle('Inicio');
    } else if (path.startsWith('/trivia')) {
      setActiveView('trivia');
      if (path === '/trivia') setPageTitle('Trivia');
      else if (path.includes('/lobby/')) setPageTitle('Sala de Espera');
      else if (path.includes('/game/')) setPageTitle('Jugando Trivia');
      else if (path.includes('/results/')) setPageTitle('Resultados');
      else if (path.includes('/leaderboard')) setPageTitle('Clasificación');
    }
  }, [location.pathname, setActiveView, setPageTitle]);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  // Si estamos en modo juego, renderizar solo el contenido sin header/sidebar/footer
  if (isGameMode) {
    return (
      <div className="app-layout" style={{ background: 'transparent' }}>
        <main className="app-layout__content" style={{ padding: 0, margin: 0 }}>
          {children}
        </main>
      </div>
    );
  }

  // Layout normal con header, sidebar y footer
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__main">
        <Header />
        <main className="app-layout__content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

