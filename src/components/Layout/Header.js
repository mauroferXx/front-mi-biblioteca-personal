import React, { useEffect, useRef, useState } from 'react';
import { Menu, User } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { libraryAPI } from '../../services/api';

const Header = () => {
  const { pageTitle, toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadUserProgress();
    }
    
    // Escuchar eventos de actualización de XP
    const handleXPUpdate = () => {
      if (user?.id) {
        loadUserProgress();
      }
    };
    
    window.addEventListener('xp-updated', handleXPUpdate);
    return () => {
      window.removeEventListener('xp-updated', handleXPUpdate);
    };
  }, [user?.id]);

  const loadUserProgress = async () => {
    if (!user?.id) return;
    try {
      const res = await libraryAPI.getUserProgress(user.id);
      if (res?.success) {
        setUserProgress(res.user);
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
    }
  };

  const displayName = user?.name || user?.username || 'Invitado';
  const initials = (displayName || '')
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button onClick={toggleSidebar} className="app-header__button" aria-label="Abrir menú">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="app-header__title">{pageTitle}</h1>
      </div>
      <div className="app-header__right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Información de Nivel y XP */}
        {userProgress && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ minWidth: '120px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Nivel {userProgress.level}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  #{userProgress.rank}
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '6px', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '3px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  width: `${userProgress.progress.percentage}%`, 
                  height: '100%', 
                  backgroundColor: '#3b82f6',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '0.25rem',
                fontSize: '0.7rem',
                color: '#6b7280'
              }}>
                <span>{userProgress.progress.xpInCurrentLevel} XP</span>
                <span>{userProgress.progress.xpForNextLevel} XP</span>
              </div>
            </div>
          </div>
        )}

        {/* Usuario */}
        <div className="app-header__user" ref={menuRef} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setOpen(v => !v)}>
          <span className="app-header__user-name">{displayName}</span>
          <div className="app-header__avatar">
            {initials || <User className="w-4 h-4" />}
          </div>
          {open && (
            <div className="card" style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, minWidth: '12rem', zIndex: 50, padding: '0.5rem' }}>
              <div className="text-sm text-gray-600" style={{ padding: '0.5rem' }}>{displayName}</div>
              <button
                className="btn btn-secondary w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  logout();
                  navigate('/login', { replace: true });
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

