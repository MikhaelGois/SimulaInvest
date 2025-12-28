import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSymbolSnapshot } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import { FaChartLine, FaDollarSign, FaPercent, FaStar, FaRegStar, FaExternalLinkAlt } from 'react-icons/fa';

interface SymbolData {
  ticker: string;
  name: string;
  price: number;
  change_percent: number;
  market_cap: number;
  dividend_yield: number;
  currency: string;
  links: {
    [source: string]: string;
  };
}

const SymbolDetailPage: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [data, setData] = useState<SymbolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!ticker) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getSymbolSnapshot(ticker);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Falha ao buscar dados do ativo.');
        // Mock data for demonstration purposes if the API call fails
        if (!data) {
            setData({
                ticker: ticker.toUpperCase(),
                name: "Ativo de Exemplo",
                price: 105.50,
                change_percent: 1.25,
                market_cap: 15000000000,
                dividend_yield: 0.085,
                currency: "BRL",
                links: { google_finance: '#', yahoo_finance: '#', status_invest: '#' }
            });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    checkFavorite();
  }, [ticker]);

  const checkFavorite = () => {
    if (!ticker) return;
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favs.includes(ticker));
  };

  const toggleFavorite = () => {
    if (!ticker) return;
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavs = isFavorite ? favs.filter((t: string) => t !== ticker) : [...favs, ticker];
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };
  
  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  if (!data) return <div className="container mx-auto p-4 text-center">Nenhum dado encontrado para este ativo.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">{data.name} ({data.ticker})</h1>
            <button onClick={toggleFavorite} className="text-3xl text-yellow-400">
                {isFavorite ? <FaStar /> : <FaRegStar />}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="Cotação">
                <p className="text-4xl font-bold">R$ {data.price.toFixed(2)}</p>
                <p className={`flex items-center text-lg ${data.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <FaChartLine className="mr-2" /> 
                    {data.change_percent.toFixed(2)}%
                </p>
            </Card>
            <Card title="Métricas">
                <div className="space-y-2">
                    <p className="flex justify-between"><span><FaDollarSign className="inline mr-2" />Valor de Mercado:</span> <strong>R$ {(data.market_cap / 1e9).toFixed(2)} Bi</strong></p>
                    <p className="flex justify-between"><span><FaPercent className="inline mr-2" />Dividend Yield:</span> <strong>{(data.dividend_yield * 100).toFixed(2)}%</strong></p>
                </div>
            </Card>
        </div>

        <Card title="Links de Análise">
            <div className="flex flex-wrap gap-4">
                {Object.entries(data.links).map(([source, url]) => (
                    <a href={url} key={source} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                        {source.replace('_', ' ')} <FaExternalLinkAlt className="ml-2" />
                    </a>
                ))}
            </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SymbolDetailPage;
