import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  token: string | null;
  subscriptionPlan: string | null;
  login: (token: string, email: string, plan: string) => void;
  logout: () => void;
  updateSubscriptionPlan: (newPlan: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('simulainvest_token');
    const storedEmail = localStorage.getItem('simulainvest_user_email');
    const storedPlan = localStorage.getItem('simulainvest_subscription_plan');
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setUserEmail(storedEmail);
      setSubscriptionPlan(storedPlan || 'free');
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newToken: string, email: string, plan: string) => {
    localStorage.setItem('simulainvest_token', newToken);
    localStorage.setItem('simulainvest_user_email', email);
    localStorage.setItem('simulainvest_subscription_plan', plan);
    setToken(newToken);
    setUserEmail(email);
    setSubscriptionPlan(plan);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('simulainvest_token');
    localStorage.removeItem('simulainvest_user_email');
    localStorage.removeItem('simulainvest_subscription_plan');
    setToken(null);
    setUserEmail(null);
    setSubscriptionPlan(null);
    setIsAuthenticated(false);
  };

  const updateSubscriptionPlan = (newPlan: string) => {
    localStorage.setItem('simulainvest_subscription_plan', newPlan);
    setSubscriptionPlan(newPlan);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, token, subscriptionPlan, login, logout, updateSubscriptionPlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
