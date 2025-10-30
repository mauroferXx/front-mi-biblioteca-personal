import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Completa usuario y contraseña');
      return;
    }
    setLoading(true);
    const res = await login(username.trim(), password);
    setLoading(false);
    if (!res.success) {
      toast.error(res.error || 'Error de autenticación');
      return;
    }
    toast.success('Sesión iniciada');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-full" style={{ display: 'grid', placeItems: 'center', padding: '3rem 1rem', background: '#f3f4f6' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h1 className="text-2xl font-bold" style={{ marginBottom: '1rem' }}>Iniciar sesión</h1>
        <p className="text-sm text-gray-600" style={{ marginBottom: '1.5rem' }}>
          Usa un usuario hardcodeado (por ejemplo: admin/admin123, mauro/mauro123, guest/guest)
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700" htmlFor="username">Usuario o correo</label>
            <input
              id="username"
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario o correo"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className={`btn btn-primary w-full`} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <div className="text-sm" style={{ marginTop: '1rem', textAlign: 'center' }}>
          ¿No tienes cuenta? <a href="/register" className="link">Regístrate</a>
        </div>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: 420, marginTop: '1rem' }}>
        <h2 className="text-lg font-semibold" style={{ marginBottom: '0.75rem' }}>Usuarios de prueba</h2>
        <div className="grid-3" style={{ gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setUsername('zorro'); setPassword('animal123'); }}
            title="zorro"
          >
            🦊 zorro
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setUsername('tigre'); setPassword('animal123'); }}
            title="tigre"
          >
            🐯 tigre
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setUsername('panda'); setPassword('animal123'); }}
            title="panda"
          >
            🐼 panda
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


