import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

interface Recommendation {
  ticker: string;
  score: number;
  components: {
    [key: string]: number;
  };
  explanation: string;
}

const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await getRecommendations();
        setRecommendations(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Não foi possível buscar as recomendações.');
        // Para demonstração, vamos usar dados mockados em caso de erro, 
        // já que o endpoint pode não estar 100% funcional.
        const mockData = [
            { ticker: 'XPTO11', score: 0.85, components: { valuation_score: 0.9, dividend_score: 0.8 }, explanation: 'Score alto devido a forte valoração e dividendos consistentes.'},
            { ticker: 'ABCD3', score: 0.76, components: { valuation_score: 0.7, dividend_score: 0.82 }, explanation: 'Bom pagador de dividendos com valuation razoável.'}
        ];
        setRecommendations(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const renderScore = (score: number) => {
    const color = score > 0.8 ? 'text-green-500' : score > 0.6 ? 'text-yellow-500' : 'text-red-500';
    return <span className={`font-bold text-lg ${color}`}>{(score * 100).toFixed(1)}</span>;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Ranking de Ativos</h1>
        <p className="text-center text-gray-600 mb-8">Nossas recomendações baseadas em scores de valuation e dividendos.</p>
        
        {loading && <div className="flex justify-center mt-8"><LoadingSpinner /></div>}
        
        {error && <div className="mt-6 text-center text-red-600 bg-red-100 p-4 rounded-lg font-semibold">{error}</div>}

        {!loading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {recommendations.map((rec, index) => (
                  <li key={rec.ticker} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-500 font-bold text-lg mr-4">#{index + 1}</span>
                        <div>
                          <Link to={`/symbols/${rec.ticker}`} className="text-xl font-bold text-blue-600 hover:underline">{rec.ticker}</Link>
                          <p className="text-sm text-gray-600 mt-1">{rec.explanation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-700">Score</div>
                        {renderScore(rec.score)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RecommendationsPage;
