import React, { useState } from 'react';
import { postSimulatorTimeToTarget, TimeToTargetParams } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const SimulatorPage: React.FC = () => {
  const [params, setParams] = useState<TimeToTargetParams>({
    initial_investment: 1000,
    target_value: 100000,
    monthly_contribution: 300,
    risk_profile: 'moderate',
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Garante que valores numéricos sejam armazenados como números
    const isNumberInput = e.target.type === 'number';
    setParams(prev => ({ ...prev, [name]: isNumberInput ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await postSimulatorTimeToTarget(params);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ocorreu um erro ao rodar a simulação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Simulador de Investimentos</h1>
        <p className="text-center text-gray-600 mb-8">Descubra em quanto tempo você pode atingir seu objetivo financeiro.</p>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold">Investimento Inicial (R$)</label>
                <input type="number" name="initial_investment" value={params.initial_investment} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Valor Alvo (R$)</label>
                <input type="number" name="target_value" value={params.target_value} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Aporte Mensal (R$)</label>
                <input type="number" name="monthly_contribution" value={params.monthly_contribution} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Perfil de Risco</label>
                <select name="risk_profile" value={params.risk_profile} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                  <option value="conservative">Conservador</option>
                  <option value="moderate">Moderado</option>
                  <option value="aggressive">Agressivo</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
              {loading ? 'Calculando...' : 'Simular'}
            </button>
          </form>

          {loading && <div className="mt-6 flex justify-center"><LoadingSpinner /></div>}

          {error && <div className="mt-6 text-red-600 bg-red-100 p-4 rounded-lg text-center font-semibold">{error}</div>}

          {result && (
            <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultado da Simulação</h2>
              <div className="space-y-3">
                <p><strong>Tempo estimado (determinístico):</strong> {result.deterministic_months} meses (~{(result.deterministic_months / 12).toFixed(1)} anos)</p>
                <div className="pt-2">
                    <h3 className="font-bold text-lg">Simulação de Monte Carlo:</h3>
                    <p><strong>Tempo médio:</strong> {result.monte_carlo_mean_months} meses (~{(result.monte_carlo_mean_months / 12).toFixed(1)} anos)</p>
                    <p><strong>Intervalo de Confiança (95%):</strong> Entre {result.monte_carlo_conf_interval[0]} e {result.monte_carlo_conf_interval[1]} meses.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SimulatorPage;
