import React, { useEffect, useRef, useState } from 'react';
import { Menu, User } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { pageTitle, toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
    </header>
  );
};

export default Header;

