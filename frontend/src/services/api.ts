import axios from 'axios';

// Use a variável de ambiente para a URL da API para facilitar a configuração
// em diferentes ambientes (desenvolvimento, produção).
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSymbolSnapshot = (ticker: string) => {
  return apiClient.get(`/symbols/${ticker}/snapshot`);
};

export interface TimeToTargetParams {
  initial_investment: number;
  target_value: number;
  monthly_contribution: number;
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
}

export const postSimulatorTimeToTarget = (params: TimeToTargetParams) => {
  return apiClient.post('/simulator/time-to-target', params);
};

export const getRecommendations = () => {
  return apiClient.get('/analytics/recommendations');
};

export const checkHealth = () => {
  return apiClient.get('/health');
};

export default apiClient;
