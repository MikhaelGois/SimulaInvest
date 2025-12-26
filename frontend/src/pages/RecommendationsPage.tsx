import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaChartLine, FaBuilding, FaStar, FaRegStar } from 'react-icons/fa';

const API_BASE = 'http://localhost:8000/api/v1';

interface Asset {
  ticker: string;
  name: string;
  type: 'acao' | 'fii';
  price: number;
  dividend_yield: number;
  change_percent: number;
}

const RecommendationsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([
    { ticker: 'PETR4', name: 'Petrobras', type: 'acao', price: 38.10, dividend_yield: 0.121, change_percent: 1.5 },
    { ticker: 'VALE3', name: 'Vale S.A.', type: 'acao', price: 65.20, dividend_yield: 0.058, change_percent: 2.3 },
    { ticker: 'ITUB4', name: 'Itaú Unibanco', type: 'acao', price: 32.50, dividend_yield: 0.072, change_percent: -0.5 },
    { ticker: 'BBDC4', name: 'Bradesco', type: 'acao', price: 14.80, dividend_yield: 0.085, change_percent: 0.8 },
    { ticker: 'ABEV3', name: 'Ambev', type: 'acao', price: 12.45, dividend_yield: 0.045, change_percent: -1.2 },
    { ticker: 'WEGE3', name: 'WEG', type: 'acao', price: 45.30, dividend_yield: 0.015, change_percent: 3.1 },
    { ticker: 'HGLG11', name: 'CSHG Logística', type: 'fii', price: 168.50, dividend_yield: 0.095, change_percent: 0.3 },
    { ticker: 'KNRI11', name: 'Kinea Renda Imob', type: 'fii', price: 165.00, dividend_yield: 0.098, change_percent: 0.5 },
    { ticker: 'VISC11', name: 'Vinci Shopping', type: 'fii', price: 98.20, dividend_yield: 0.087, change_percent: -0.2 },
    { ticker: 'MXRF11', name: 'Maxi Renda', type: 'fii', price: 10.80, dividend_yield: 0.120, change_percent: 0.7 },
  ]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'acao' | 'fii'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'dividend' | 'change'>('dividend');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, sortBy, searchTerm]);

  const applyFilters = () => {
    let filtered = [...assets];

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.type === filterType);
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'dividend') return b.dividend_yield - a.dividend_yield;
      if (sortBy === 'change') return b.change_percent - a.change_percent;
      return 0;
    });

    setFilteredAssets(filtered);
  };

  const toggleFavorite = (ticker: string) => {
    const newFavs = favorites.includes(ticker)
      ? favorites.filter(t => t !== ticker)
      : [...favorites, ticker];
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="header-text text-center mb-4">
        Nossas <span className="text-gradient-accent">Recomendações</span>
      </h1>
      <p className="text-center text-primary-600 mb-8">
        "A sabedoria é mais preciosa que o ouro." - Provérbios 16:16. Encontre ativos alinhados aos seus objetivos.
      </p>

      {/* Filtros */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Buscar Ativo</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: PETR, Petrobras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Filtrar por Tipo</label>
            <select
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">Todos</option>
              <option value="acao">Ações</option>
              <option value="fii">FIIs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">Ordenar por</label>
            <select
              className="input-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="dividend">Dividend Yield</option>
              <option value="price">Preço</option>
              <option value="change">Variação</option>
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : filteredAssets.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-primary-500 text-lg">
            Nenhuma recomendação encontrada para os filtros selecionados.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            const isFav = favorites.includes(asset.ticker);
            return (
              <Card key={asset.ticker} className="hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-2">
                    {asset.type === 'acao' ? (
                      <FaChartLine className="text-accent-DEFAULT text-xl mt-1" />
                    ) : (
                      <FaBuilding className="text-secondary-DEFAULT text-xl mt-1" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-primary-900">{asset.ticker}</h3>
                      <p className="text-sm text-primary-500">{asset.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${asset.type === 'fii' ? 'bg-secondary-light text-secondary-dark' : 'bg-accent-light text-accent-dark'}`}>
                        {asset.type === 'fii' ? 'FII' : 'Ação'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => toggleFavorite(asset.ticker)} className="text-2xl">
                    {isFav ? <FaStar className="text-secondary-DEFAULT" /> : <FaRegStar className="text-primary-400" />}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 text-sm">Preço:</span>
                    <span className="font-semibold text-lg text-primary-900">R$ {asset.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 text-sm">DY (TTM):</span>
                    <span className="font-semibold text-accent-DEFAULT">{(asset.dividend_yield * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 text-sm">Variação:</span>
                    <span className={`font-semibold ${asset.change_percent >= 0 ? 'text-success' : 'text-danger'}`}>
                      {asset.change_percent >= 0 ? '+' : ''}{asset.change_percent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/symbol/${asset.ticker}`} className="btn-primary flex-1 text-center text-sm py-2">
                    Ver Detalhes
                  </Link>
                  <Link to={`/simulator?ticker=${asset.ticker}`} className="btn-secondary flex-1 text-center text-sm py-2">
                    Simular
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="mt-8 bg-primary-50">
        <h3 className="font-semibold text-primary-800 mb-2">💡 Sobre as Recomendações</h3>
        <p className="text-sm text-primary-600">
          As recomendações são baseadas em análises de múltiplas fontes (Yahoo Finance, Investidor10, Status Invest).
          Sempre faça sua própria análise antes de investir.
        </p>
      </Card>
    </div>
  );
};

export default RecommendationsPage;
