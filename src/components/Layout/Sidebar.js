import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Brain, X, BookOpen } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, closeSidebar, setActiveView, setPageTitle } = useUIStore();

  const menuItems = [
    { id: 'home', name: 'Inicio', icon: Home, path: '/' },
    { id: 'library', name: 'Biblioteca', icon: BookOpen, path: '/library' },
    { id: 'trivia', name: 'Trivia', icon: Brain, path: '/trivia' }
  ];

  const handleNavigation = (item) => {
    navigate(item.path);
    setActiveView(item.id);
    setPageTitle(item.name);
    closeSidebar();
  };

  const isActive = (item) => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      <div
        className={`app-sidebar__overlay ${sidebarOpen ? 'is-open' : ''}`}
        onClick={closeSidebar}
      />

      <aside className={`app-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="app-sidebar__header">
          <span className="app-sidebar__brand">📚 Biblioteca</span>
          <button onClick={closeSidebar} className="app-sidebar__close" aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>

        <nav className="app-sidebar__nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`app-sidebar__item ${active ? 'active' : ''}`}
              >
                <Icon className="app-sidebar__icon" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">v1.0.0 - Biblioteca Digital</div>
      </aside>
    </>
  );
};

export default Sidebar;

