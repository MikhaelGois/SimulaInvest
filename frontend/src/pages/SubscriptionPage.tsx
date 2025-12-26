import React from 'react';
import { FaCrown, FaCheckCircle, FaTimesCircle, FaGem } from 'react-icons/fa';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const SubscriptionPage: React.FC = () => {
  const { subscriptionPlan, isAuthenticated, updateSubscriptionPlan } = useAuth();

  const handleUpgrade = (plan: string) => {
    if (!isAuthenticated) {
      alert('Por favor, faça login para assinar.');
      return;
    }
    alert(`Simulação de upgrade para o plano ${plan.toUpperCase()}. Integração real com pagamento deve ser configurada.`);
    updateSubscriptionPlan(plan);
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="header-text mb-4">
        Escolha seu <span className="text-gradient-secondary">Plano</span>
      </h1>
      <p className="sub-header-text mb-8">
        "Aquele que semeia com fartura, com fartura também colherá." - 2 Coríntios 9:6
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className={`border-2 ${subscriptionPlan === 'free' ? 'border-accent' : 'border-primary-200'}`}>
          <FaCrown className="text-primary-400 text-5xl mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-primary-800 mb-2">Plano Gratuito</h3>
          <p className="text-primary-600 mb-6">Perfeito para começar sua jornada.</p>

          <div className="text-left space-y-2 mb-8">
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Acesso a recomendações básicas</p>
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Simulador determinístico</p>
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Watchlist (até 10 ativos)</p>
            <p className="flex items-center text-primary-500"><FaTimesCircle className="text-danger mr-2" /> Simulador Monte Carlo</p>
            <p className="flex items-center text-primary-500"><FaTimesCircle className="text-danger mr-2" /> Otimização de carteira</p>
            <p className="flex items-center text-primary-500"><FaTimesCircle className="text-danger mr-2" /> Backtesting avançado</p>
          </div>

          {subscriptionPlan === 'free' ? (
            <button className="btn-primary w-full opacity-70 cursor-not-allowed">Seu Plano Atual</button>
          ) : (
            <button onClick={() => handleUpgrade('free')} className="btn-primary w-full">Escolher Plano Gratuito</button>
          )}
        </Card>

        <Card className={`border-2 ${subscriptionPlan === 'pro' ? 'border-secondary' : 'border-primary-200'}`}>
          <FaGem className="text-secondary text-5xl mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-primary-800 mb-2">Plano Pro</h3>
          <p className="text-primary-600 mb-6">Para investidores que buscam o máximo potencial.</p>

          <div className="text-left space-y-2 mb-8">
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Todas as funcionalidades do Free</p>
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Simulador Monte Carlo ilimitado</p>
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Otimização de carteira</p>
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Backtesting avançado</p>
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Watchlist ilimitada</p>
            <p className="flex items-center text-primary-700"><FaCheckCircle className="text-success mr-2" /> Suporte prioritário</p>
          </div>

          {subscriptionPlan === 'pro' ? (
            <button className="btn-secondary w-full opacity-70 cursor-not-allowed">Seu Plano Atual</button>
          ) : (
            <button onClick={() => handleUpgrade('pro')} className="btn-secondary w-full">Fazer Upgrade para Pro</button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
