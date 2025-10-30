import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Completa nombre, correo y contraseña');
      return;
    }
    try {
      const res = await authAPI.register({ name: name.trim(), email: email.trim(), password });
      if (res?.success) {
        toast.success('Registro exitoso. Inicia sesión.');
        navigate('/login');
      } else {
        toast.error(res?.error || 'No se pudo registrar');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Error registrando usuario';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-full" style={{ display: 'grid', placeItems: 'center', padding: '3rem 1rem', background: '#f3f4f6' }}>
      <div className="card" style={{ width: '100%', maxWidth: 480 }}>
        <h1 className="text-2xl font-bold" style={{ marginBottom: '1rem' }}>Crear cuenta</h1>
        <p className="text-sm text-gray-600" style={{ marginBottom: '1.5rem' }}>
          Completa tus datos para registrarte.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700" htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700" htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
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
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">Registrarme</button>
        </form>
        <div className="text-sm" style={{ marginTop: '1rem', textAlign: 'center' }}>
          ¿Ya tienes cuenta? <Link to="/login" className="link">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


