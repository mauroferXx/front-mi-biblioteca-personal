import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SocketProvider } from './services/SocketContext';
import { AuthProvider } from './services/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LibraryPage from './pages/LibraryPage';
import Layout from './components/Layout/Layout';
import WelcomePage from './pages/WelcomePage';
import TriviaHomePage from './pages/TriviaHomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import './styles/App.css';

function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <SocketProvider>
        {isAuthRoute ? (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        ) : (
          <Layout>
            <Routes>
              {/* Ruta principal - Bienvenida */}
              <Route path="/" element={<WelcomePage />} />

              {/* Rutas de Trivia protegidas */}
              <Route path="/trivia" element={
                <PrivateRoute>
                  <TriviaHomePage />
                </PrivateRoute>
              } />
              <Route path="/library" element={
                <PrivateRoute>
                  <LibraryPage />
                </PrivateRoute>
              } />
              <Route path="/trivia/lobby/:roomId" element={
                <PrivateRoute>
                  <LobbyPage />
                </PrivateRoute>
              } />
              <Route path="/trivia/game/:roomId" element={
                <PrivateRoute>
                  <GamePage />
                </PrivateRoute>
              } />
              <Route path="/trivia/results/:roomId" element={
                <PrivateRoute>
                  <ResultsPage />
                </PrivateRoute>
              } />
              <Route path="/trivia/leaderboard" element={
                <PrivateRoute>
                  <LeaderboardPage />
                </PrivateRoute>
              } />
            </Routes>
          </Layout>
        )}
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
