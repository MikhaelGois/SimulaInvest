import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaStar, FaTrashAlt, FaChartLine, FaDollarSign } from 'react-icons/fa';

const API_BASE = 'http://localhost:8000/api/v1';

interface FavoriteAsset {
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

const WatchlistPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteAsset[]>([]);
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const stored = localStorage.getItem('favorites');
    if (stored) {
      const favList: string[] = JSON.parse(stored);
      const assets: FavoriteAsset[] = favList.map(t => ({
        t,
        tipo: t.endsWith('11') ? 'fii' : 'acao',
        name: t
      }));
      setFavorites(assets);
      
      // Carregar cotações
      const newQuotes: Record<string, QuoteData> = {};
      for (const asset of assets) {
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
    }
    setLoading(false);
  };

  const removeFavorite = (ticker: string) => {
    const newFavs = favorites.filter(f => f.t !== ticker);
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs.map(f => f.t)));
    const newQuotes = { ...quotes };
    delete newQuotes[ticker];
    setQuotes(newQuotes);
  };

  const refreshQuotes = () => {
    loadFavorites();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="header-text">
          Sua <span className="text-gradient-accent">Watchlist</span> <FaStar className="inline text-secondary-DEFAULT" />
        </h1>
        <button onClick={refreshQuotes} className="btn-secondary">
          Atualizar Cotações
        </button>
      </div>
      <p className="text-center text-primary-600 mb-8">
        "Vigiai e orai, para que não entreis em tentação." - Mateus 26:41. Monitore seus ativos de interesse.
      </p>

      {favorites.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <FaStar className="text-primary-300 text-6xl mx-auto mb-4" />
            <p className="text-xl text-primary-600 mb-6">
              Sua watchlist está vazia. Comece a adicionar ativos que você deseja monitorar!
            </p>
            <Link to="/" className="btn-primary text-lg px-6 py-3">
              Explorar Ativos Populares
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(asset => {
            const quote = quotes[asset.t];
            return (
              <Card key={asset.t} className="relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-primary-900">{asset.t}</h3>
                    <p className="text-sm text-primary-500">{asset.name}</p>
                    <span className={`text-xs px-2 py-1 rounded ${asset.tipo === 'fii' ? 'bg-secondary-light text-secondary-dark' : 'bg-accent-light text-accent-dark'}`}>
                      {asset.tipo === 'fii' ? 'FII' : 'Ação'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFavorite(asset.t)}
                    className="text-danger hover:bg-danger hover:text-white p-2 rounded transition"
                    title="Remover dos favoritos"
                  >
                    <FaTrashAlt />
                  </button>
                </div>

                {quote ? (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 text-sm flex items-center">
                        <FaDollarSign className="mr-1" /> Preço:
                      </span>
                      <span className="font-bold text-lg text-primary-900">
                        R$ {quote.price?.toFixed(2) || '-'}
                      </span>
                    </div>
                    {quote.change_percent !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 text-sm flex items-center">
                          <FaChartLine className="mr-1" /> Variação:
                        </span>
                        <span className={`font-semibold ${quote.change_percent >= 0 ? 'text-success' : 'text-danger'}`}>
                          {quote.change_percent >= 0 ? '+' : ''}{quote.change_percent.toFixed(2)}%
                        </span>
                      </div>
                    )}
                    {quote.dividend_yield && (
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 text-sm">DY (TTM):</span>
                        <span className="font-semibold text-accent-DEFAULT">
                          {(quote.dividend_yield * 100).toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-primary-500 mb-4">Carregando cotação...</p>
                )}

                <div className="flex gap-2">
                  <Link
                    to={`/symbol/${asset.t}`}
                    className="btn-primary flex-1 text-center text-sm py-2"
                  >
                    Detalhes
                  </Link>
                  <Link
                    to={`/simulator?ticker=${asset.t}`}
                    className="btn-secondary flex-1 text-center text-sm py-2"
                  >
                    Simular
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {favorites.length > 0 && (
        <Card className="mt-8 bg-primary-50">
          <h3 className="font-semibold text-primary-800 mb-2">💡 Dica</h3>
          <p className="text-sm text-primary-600">
            Clique em "Atualizar Cotações" para ver os preços mais recentes. Os favoritos são salvos no seu navegador.
          </p>
        </Card>
      )}
    </div>
  );
};

export default WatchlistPage;
