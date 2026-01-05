import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8000/api/v1';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [riskProfile, setRiskProfile] = useState('');
  const [objective, setObjective] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, risk_profile: riskProfile, objective }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha no registro.');
      }

      const loginFormData = new URLSearchParams();
      loginFormData.append('username', email);
      loginFormData.append('password', password);

      const loginResponse = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: loginFormData.toString(),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.detail || 'Falha no login automático após registro.');
      }

      const loginData = await loginResponse.json();
      const plan = loginData.subscription_plan || 'free';
      login(loginData.access_token, email, plan);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card title="Crie sua Conta no SimulaInvest">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-primary-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-primary-700 text-sm font-bold mb-2">Senha</label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-primary-700 text-sm font-bold mb-2">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="riskProfile" className="block text-primary-700 text-sm font-bold mb-2">Perfil de Risco (Opcional)</label>
            <select
              id="riskProfile"
              className="input-field"
              value={riskProfile}
              onChange={(e) => setRiskProfile(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="conservador">Conservador</option>
              <option value="moderado">Moderado</option>
              <option value="arrojado">Arrojado</option>
            </select>
          </div>
          <div>
            <label htmlFor="objective" className="block text-primary-700 text-sm font-bold mb-2">Objetivo de Investimento (Opcional)</label>
            <select
              id="objective"
              className="input-field"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="dividendos">Dividendos</option>
              <option value="valorizacao">Valorização</option>
              <option value="misto">Misto</option>
            </select>
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Registrando...' : <><FaUserPlus className="inline-block mr-2" /> Registrar</>}
          </button>
        </form>
        <p className="mt-4 text-center text-primary-600">
          Já tem uma conta? <Link to="/login" className="text-accent hover:underline">Entrar</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
