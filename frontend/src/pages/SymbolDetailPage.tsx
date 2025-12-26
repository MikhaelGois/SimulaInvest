import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaChartLine, FaDollarSign, FaPercent, FaStar, FaRegStar, FaExternalLinkAlt } from 'react-icons/fa';

const API_BASE = 'http://localhost:8000/api/v1';

interface SymbolData {
  ticker: string;
  price: number;
  change_percent: number | null;
  dividend_yield: number | null;
  currency: string;
  yahoo: any;
  investidor10: any;
  status_invest: any;
  links: {
    google_finance: string;
    yahoo_finance: string;
    investidor10: string;
    status_invest: string;
  };
}

const SymbolDetailPage: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [symbolData, setSymbolData] = useState<SymbolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (ticker) {
      loadSymbolData();
      checkFavorite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  const loadSymbolData = async () => {
    if (!ticker) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/symbols/quote/${ticker}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar dados do ativo.');
      }
      const data: SymbolData = await response.json();
      setSymbolData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = () => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      const favs: string[] = JSON.parse(stored);
      setIsFavorite(favs.includes(ticker || ''));
    }
  };

  const toggleFavorite = () => {
    if (!ticker) return;
    const stored = localStorage.getItem('favorites');
    let favs: string[] = stored ? JSON.parse(stored) : [];
    
    if (isFavorite) {
      favs = favs.filter(t => t !== ticker);
    } else {
      favs.push(ticker);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card>
        <div className="text-center text-danger text-lg py-8">
          <p className="mb-4">Erro: {error}</p>
          <Link to="/" className="btn-primary">Voltar para Home</Link>
        </div>
      </Card>
    );
  }

  if (!symbolData) {
    return (
      <Card>
        <div className="text-center text-primary-600 text-lg py-8">
          <p className="mb-4">Ativo não encontrado.</p>
          <Link to="/" className="btn-primary">Voltar para Home</Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="header-text text-primary-900">
            {symbolData.yahoo?.name || ticker} (<span className="text-accent-DEFAULT">{symbolData.ticker}</span>)
          </h1>
          <p className="text-primary-500 mt-1">Última atualização: {new Date().toLocaleString('pt-BR')}</p>
        </div>
        <button
          onClick={toggleFavorite}
          className={`p-3 rounded-full ${isFavorite ? 'bg-secondary-DEFAULT text-white' : 'bg-primary-200 text-primary-600'} hover:opacity-80 transition duration-300`}
          title={isFavorite ? "Remover da Watchlist" : "Adicionar à Watchlist"}
        >
          {isFavorite ? <FaStar className="text-2xl" /> : <FaRegStar className="text-2xl" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Cotação Atual">
          <p className="text-5xl font-bold text-primary-900 mb-2">
            {symbolData.currency} {symbolData.price?.toFixed(2) || '-'}
          </p>
          {symbolData.change_percent !== null && (
            <div className={`flex items-center mt-4 ${symbolData.change_percent >= 0 ? 'text-success' : 'text-danger'} font-semibold text-lg`}>
              <FaChartLine className="mr-2" />
              {symbolData.change_percent >= 0 ? '+' : ''}{symbolData.change_percent.toFixed(2)}%
              <span className="text-sm ml-2 text-primary-500">(hoje)</span>
            </div>
          )}
        </Card>

        <Card title="Métricas Chave">
          <div className="space-y-3">
            {symbolData.yahoo?.market_cap && (
              <div className="flex justify-between items-center">
                <span className="text-primary-600 flex items-center">
                  <FaDollarSign className="mr-2 text-primary-400" />
                  Valor de Mercado:
                </span>
                <span className="font-semibold text-primary-800">
                  {symbolData.currency} {(symbolData.yahoo.market_cap / 1_000_000_000).toFixed(2)}B
                </span>
              </div>
            )}
            {symbolData.dividend_yield && (
              <div className="flex justify-between items-center">
                <span className="text-primary-600 flex items-center">
                  <FaPercent className="mr-2 text-primary-400" />
                  Dividend Yield (TTM):
                </span>
                <span className="font-semibold text-accent-DEFAULT">
                  {(symbolData.dividend_yield * 100).toFixed(2)}%
                </span>
              </div>
            )}
            {symbolData.yahoo?.previous_close && (
              <div className="flex justify-between items-center">
                <span className="text-primary-600 flex items-center">
                  <FaChartLine className="mr-2 text-primary-400" />
                  Fechamento Anterior:
                </span>
                <span className="font-semibold text-primary-800">
                  {symbolData.currency} {symbolData.yahoo.previous_close.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Links Externos */}
      <Card title="Análise Detalhada" className="mb-8">
        <p className="text-primary-600 mb-4">
          Acesse análises completas deste ativo nos principais sites de investimentos:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a
            href={symbolData.links.google_finance}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center flex items-center justify-center gap-2"
          >
            Google Finance <FaExternalLinkAlt className="text-xs" />
          </a>
          <a
            href={symbolData.links.yahoo_finance}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center flex items-center justify-center gap-2"
          >
            Yahoo Finance <FaExternalLinkAlt className="text-xs" />
          </a>
          <a
            href={symbolData.links.investidor10}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-center flex items-center justify-center gap-2"
          >
            Investidor10 <FaExternalLinkAlt className="text-xs" />
          </a>
          <a
            href={symbolData.links.status_invest}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-center flex items-center justify-center gap-2"
          >
            Status Invest <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </Card>

      {/* Fontes de Dados */}
      <Card title="Dados Consolidados" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-primary-200 rounded p-3">
            <h4 className="font-semibold text-primary-800 mb-2 flex items-center">
              <span className="w-2 h-2 bg-accent-DEFAULT rounded-full mr-2"></span>
              Yahoo Finance
            </h4>
            <p className="text-sm text-primary-600">
              {symbolData.yahoo ? 'Dados disponíveis' : 'Indisponível'}
            </p>
          </div>
          <div className="border border-primary-200 rounded p-3">
            <h4 className="font-semibold text-primary-800 mb-2 flex items-center">
              <span className="w-2 h-2 bg-secondary-DEFAULT rounded-full mr-2"></span>
              Investidor10
            </h4>
            <p className="text-sm text-primary-600">
              {symbolData.investidor10 ? 'Dados disponíveis' : 'Indisponível'}
            </p>
          </div>
          <div className="border border-primary-200 rounded p-3">
            <h4 className="font-semibold text-primary-800 mb-2 flex items-center">
              <span className="w-2 h-2 bg-accent-DEFAULT rounded-full mr-2"></span>
              Status Invest
            </h4>
            <p className="text-sm text-primary-600">
              {symbolData.status_invest ? 'Dados disponíveis' : 'Indisponível'}
            </p>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link to={`/simulator?ticker=${ticker}`} className="btn-primary text-lg px-8 py-3 text-center">
          Simular Lucro-Alvo para {ticker}
        </Link>
        <button onClick={toggleFavorite} className="btn-secondary text-lg px-8 py-3">
          {isFavorite ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}
        </button>
      </div>
    </div>
  );
};

export default SymbolDetailPage;
