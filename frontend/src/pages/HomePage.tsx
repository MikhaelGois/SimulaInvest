import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaChartPie, FaStar, FaRegStar, FaHandHoldingUsd, FaChartLine } from 'react-icons/fa';

const API_BASE = 'http://localhost:8000/api/v1';

interface Asset {
  t: string;
  tipo: string;
  name: string;
}

interface QuoteData {
  ticker: string;
  price: number;
  change_percent: number | null;
  dividend_yield: number | null;
}

const HomePage: React.FC = () => {
  const [popularAssets, setPopularAssets] = useState<Asset[]>([
    { t: 'PETR4', tipo: 'acao', name: 'Petrobras' },
    { t: 'VALE3', tipo: 'acao', name: 'Vale' },
    { t: 'ITUB4', tipo: 'acao', name: 'Itaú Unibanco' },
    { t: 'BBDC4', tipo: 'acao', name: 'Bradesco' },
    { t: 'ABEV3', tipo: 'acao', name: 'Ambev' },
    { t: 'WEGE3', tipo: 'acao', name: 'WEG' },
    { t: 'B3SA3', tipo: 'acao', name: 'B3' },
    { t: 'RENT3', tipo: 'acao', name: 'Localiza' },
    { t: 'HGLG11', tipo: 'fii', name: 'CSHG Logística' },
    { t: 'KNRI11', tipo: 'fii', name: 'Kinea Renda' },
    { t: 'VISC11', tipo: 'fii', name: 'Vinci Shopping' },
    { t: 'MXRF11', tipo: 'fii', name: 'Maxi Renda' },
  ]);
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    const newQuotes: Record<string, QuoteData> = {};
    
    for (const asset of popularAssets.slice(0, 6)) {
      try {
        const res = await fetch(`${API_BASE}/symbols/quote/${asset.t}`);
        if (res.ok) {
          const data = await res.json();
          newQuotes[asset.t] = data;
        }
      } catch (e) {
        console.error(`Erro ao carregar ${asset.t}`);
      }
    }
    
    setQuotes(newQuotes);
    setLoading(false);
  };

  const toggleFavorite = (ticker: string) => {
    const newFavs = favorites.includes(ticker)
      ? favorites.filter(t => t !== ticker)
      : [...favorites, ticker];
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="header-text mb-4">
          Bem-vindo ao <span className="text-gradient-accent">SimulaInvest</span>
        </h1>
        <p className="sub-header-text mb-8">
          Planeje, simule e invista com clareza
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/simulator" className="btn-primary text-lg px-6 py-3">Começar Grátis</Link>
          <Link to="/recommendations" className="btn-secondary text-lg px-6 py-3">Ver Recomendações</Link>
        </div>
      </div>

      {/* Como Funciona */}
      <Card className="mb-12">
        <h2 className="text-2xl font-bold text-primary-900 mb-6 text-center">Como funciona o SimulaInvest</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
            <h3 className="font-semibold text-primary-800 mb-2">Defina seu objetivo</h3>
            <p className="text-primary-600 text-sm">Estabeleça sua meta de lucro e investimento inicial</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
            <h3 className="font-semibold text-primary-800 mb-2">Simule lucro e tempo</h3>
            <p className="text-primary-600 text-sm">Use nosso simulador Monte Carlo para previsões</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
            <h3 className="font-semibold text-primary-800 mb-2">Acompanhe e ajuste</h3>
            <p className="text-primary-600 text-sm">Monitore seus ativos favoritos e ajuste estratégias</p>
          </div>
        </div>
      </Card>

      {/* Assets Populares */}
      <Card title="Ações e FIIs Populares">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularAssets.slice(0, 6).map(asset => {
              const quote = quotes[asset.t];
              const isFav = favorites.includes(asset.t);
              return (
                <div key={asset.t} className="border border-primary-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-primary-900">{asset.t}</h3>
                      <p className="text-sm text-primary-500">{asset.name}</p>
                    </div>
                    <button onClick={() => toggleFavorite(asset.t)} className="text-xl">
                      {isFav ? <FaStar className="text-secondary-DEFAULT" /> : <FaRegStar className="text-primary-400" />}
                    </button>
                  </div>
                  {quote && (
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-primary-800">R$ {quote.price?.toFixed(2) || '-'}</p>
                      {quote.change_percent !== null && (
                        <p className={`text-sm font-medium ${quote.change_percent >= 0 ? 'text-success' : 'text-danger'}`}>
                          {quote.change_percent >= 0 ? '+' : ''}{quote.change_percent.toFixed(2)}%
                        </p>
                      )}
                      {quote.dividend_yield && (
                        <p className="text-sm text-primary-600">DY: {(quote.dividend_yield * 100).toFixed(2)}%</p>
                      )}
                    </div>
                  )}
                  <Link to={`/symbol/${asset.t}`} className="btn-primary mt-3 w-full text-center block text-sm py-1">
                    Ver Detalhes
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        <div className="text-center mt-6">
          <Link to="/recommendations" className="btn-secondary">Ver Todas as Recomendações</Link>
        </div>
      </Card>

      {/* Features Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <Card title="Simulador de Lucro-Alvo">
          <FaHandHoldingUsd className="text-secondary-DEFAULT text-5xl mx-auto mb-4" />
          <p className="text-primary-600 mb-4">
            Calcule em quanto tempo você pode atingir suas metas financeiras com simulação Monte Carlo.
          </p>
          <Link to="/simulator" className="btn-primary w-full text-center">Simular Agora</Link>
        </Card>

        <Card title="Recomendações Inteligentes">
          <FaChartPie className="text-accent-DEFAULT text-5xl mx-auto mb-4" />
          <p className="text-primary-600 mb-4">
            Descubra ações e FIIs com potencial de valorização e bons dividendos.
          </p>
          <Link to="/recommendations" className="btn-primary w-full text-center">Ver Recomendações</Link>
        </Card>

        <Card title="Acompanhe Favoritos">
          <FaStar className="text-secondary-DEFAULT text-5xl mx-auto mb-4" />
          <p className="text-primary-600 mb-4">
            Salve seus ativos favoritos e monitore o desempenho deles.
          </p>
          <Link to="/watchlist" className="btn-primary w-full text-center">Minha Watchlist</Link>
        </Card>
      </div>

      {/* Quote Section */}
      <div className="mt-16 p-8 bg-gradient-to-r from-accent-light to-secondary-light rounded-lg shadow-panel">
        <h2 className="text-2xl font-bold text-primary-900 mb-4 text-center">
          "Aquele que planeja com diligência prosperará."
        </h2>
        <p className="text-center text-primary-700 italic">- Provérbios 21:5</p>
        <p className="text-center text-primary-600 mt-4">
          No SimulaInvest, acreditamos que a boa gestão e o planejamento são chaves para alcançar seus objetivos.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
