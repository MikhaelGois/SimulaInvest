import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { FaCalculator, FaChartLine } from 'react-icons/fa';

const SimulatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTicker = searchParams.get('ticker') || '';

  const [ticker, setTicker] = useState(initialTicker);
  const [I0, setI0] = useState<number>(10000);
  const [L, setL] = useState<number>(5000);
  const [g, setG] = useState<number>(12);
  const [y, setY] = useState<number>(6);
  const [reinvest, setReinvest] = useState(true);
  const [mcMu, setMcMu] = useState<number>(10);
  const [mcSigma, setMcSigma] = useState<number>(25);
  const [mcN, setMcN] = useState<number>(1000);
  const [mcH, setMcH] = useState<number>(10);
  const [detResult, setDetResult] = useState<string>('');
  const [mcResult, setMcResult] = useState<string>('');

  const calcDeterministic = () => {
    if (!I0 || !L || !g) {
      setDetResult('Preencha I₀, L e g.');
      return;
    }
    const gDecimal = g / 100.0;
    const yDecimal = y / 100.0;
    const denom = Math.log(1 + (reinvest ? gDecimal + yDecimal : gDecimal));
    const numer = Math.log(1 + (L / I0));
    if (denom <= 0 || numer <= 0) {
      setDetResult('Parâmetros inválidos (verifique g, y e L/I₀).');
      return;
    }
    const tYears = numer / denom;
    const months = Math.round(tYears * 12);
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    setDetResult(`Tempo estimado: ${tYears.toFixed(2)} anos (~ ${years}a ${remMonths}m)`);
  };

  const gaussian = (): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const simulateMonteCarlo = () => {
    if (!I0 || !L || !mcMu || !mcSigma) {
      setMcResult('Preencha I₀, L, μ e σ.');
      return;
    }
    const mu = mcMu / 100.0;
    const sigma = mcSigma / 100.0;
    const yDecimal = y / 100.0;
    const dt = 1/12;
    const steps = mcH * 12;
    const times: number[] = [];
    let notReached = 0;

    for (let i = 0; i < mcN; i++) {
      let S = I0;
      let reachedAt: number | null = null;
      for (let k = 1; k <= steps; k++) {
        const z = gaussian();
        const drift = (mu - 0.5 * sigma * sigma) * dt;
        const shock = sigma * Math.sqrt(dt) * z;
        S = S * Math.exp(drift + shock);
        if (reinvest && yDecimal > 0) {
          S = S * (1 + yDecimal * dt);
        }
        if (S >= I0 + L && reachedAt === null) {
          reachedAt = k;
        }
      }
      if (reachedAt === null) {
        notReached++;
        times.push(mcH * 12);
      } else {
        times.push(reachedAt);
      }
    }
    times.sort((a, b) => a - b);
    const p = (q: number) => times[Math.floor(q * times.length)];
    const p10 = p(0.10), p50 = p(0.50), p90 = p(0.90);
    const fmt = (m: number) => `${(m/12).toFixed(2)}a (~ ${Math.floor(m/12)}a ${m%12}m)`;
    const probNot = (notReached / mcN * 100).toFixed(1);
    setMcResult(`p10: ${fmt(p10)} • p50: ${fmt(p50)} • p90: ${fmt(p90)} • Não bate no horizonte: ${probNot}%`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="header-text text-center mb-4">
        Simulador de <span className="text-gradient-secondary">Lucro-Alvo</span>
      </h1>
      <p className="text-center text-primary-600 mb-8">
        "O homem prudente vê o perigo e se esconde, mas os ingênuos prosseguem." - Provérbios 22:3
      </p>

      <Card title="Parâmetros da Simulação" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Ativo (Ticker B3) - Opcional</label>
            <input
              type="text"
              className="input-field"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Ex: PETR4, HGLG11"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Investimento Inicial I₀ (R$)</label>
            <input
              type="number"
              className="input-field"
              value={I0}
              onChange={(e) => setI0(parseFloat(e.target.value))}
              min="0"
              step="100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Meta de Lucro L (R$)</label>
            <input
              type="number"
              className="input-field"
              value={L}
              onChange={(e) => setL(parseFloat(e.target.value))}
              min="0"
              step="100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Crescimento Anual g (%)</label>
            <input
              type="number"
              className="input-field"
              value={g}
              onChange={(e) => setG(parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Dividendos Anuais y (%)</label>
            <input
              type="number"
              className="input-field"
              value={y}
              onChange={(e) => setY(parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reinvest"
              checked={reinvest}
              onChange={(e) => setReinvest(e.target.checked)}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="reinvest" className="text-sm font-semibold text-primary-700">Reinvestir Dividendos?</label>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Cálculo Determinístico">
          <div className="mb-4">
            <FaCalculator className="text-accent-DEFAULT text-4xl mx-auto mb-3" />
            <p className="text-sm text-primary-600 mb-4">
              Fórmula: t = ln(1+L/I₀) / ln(1+{reinvest ? 'g+y' : 'g'})
            </p>
          </div>
          <button onClick={calcDeterministic} className="btn-primary w-full mb-4">
            Calcular Tempo
          </button>
          {detResult && (
            <div className="p-4 bg-accent-light rounded-lg">
              <p className="font-semibold text-primary-900">{detResult}</p>
            </div>
          )}
        </Card>

        <Card title="Simulação Monte Carlo (β)">
          <div className="mb-4">
            <FaChartLine className="text-secondary-DEFAULT text-4xl mx-auto mb-3" />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-primary-700 mb-1">μ (retorno esperado %)</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={mcMu}
                  onChange={(e) => setMcMu(parseFloat(e.target.value))}
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary-700 mb-1">σ (volatilidade %)</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={mcSigma}
                  onChange={(e) => setMcSigma(parseFloat(e.target.value))}
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary-700 mb-1">N (simulações)</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={mcN}
                  onChange={(e) => setMcN(parseInt(e.target.value))}
                  step="100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary-700 mb-1">Horizonte (anos)</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={mcH}
                  onChange={(e) => setMcH(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
          <button onClick={simulateMonteCarlo} className="btn-secondary w-full mb-4">
            Simular Monte Carlo
          </button>
          {mcResult && (
            <div className="p-4 bg-secondary-light rounded-lg">
              <p className="text-sm font-semibold text-primary-900">{mcResult}</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 bg-primary-50">
        <h3 className="font-semibold text-primary-800 mb-2">Entendendo os Resultados</h3>
        <ul className="text-sm text-primary-600 space-y-1 list-disc list-inside">
          <li><strong>Determinístico:</strong> Estimativa baseada em taxas fixas de crescimento</li>
          <li><strong>Monte Carlo p10:</strong> Cenário otimista (10% das simulações)</li>
          <li><strong>Monte Carlo p50:</strong> Cenário mais provável (mediana)</li>
          <li><strong>Monte Carlo p90:</strong> Cenário pessimista (90% das simulações)</li>
          <li><strong>Volatilidade (σ):</strong> Representa a incerteza do mercado</li>
        </ul>
        <p className="text-xs text-primary-500 mt-4 italic">
          "Os planos do diligente tendem à abundância." - Provérbios 21:5. Lembre-se que simulações são estimativas.
        </p>
      </Card>
    </div>
  );
};

export default SimulatorPage;
