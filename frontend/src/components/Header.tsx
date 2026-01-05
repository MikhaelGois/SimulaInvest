import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaPray, FaSearch, FaHeart, FaCalculator, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaGem } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, userEmail, subscriptionPlan, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-primary-200 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <FaPray className="text-accent text-3xl" />
          <span className="text-gradient-accent header-text text-2xl">SimulaInvest</span>
          <span className="text-primary-500 text-sm italic hidden md:block">Rumo ao seu lucro-alvo</span>
        </Link>
        <nav className="flex items-center space-x-4 md:space-x-6">
          {isAuthenticated && (
            <>
              <NavLink to="/recommendations" icon={<FaChartLine />} label="Recomendações" />
              <NavLink to="/simulator" icon={<FaCalculator />} label="Simulador" />
              <NavLink to="/watchlist" icon={<FaHeart />} label="Watchlist" />
              <NavLink to="/subscription" icon={<FaGem />} label="Assinatura" />
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-primary-500 text-xl" />
              <span className="text-primary-600 text-sm hidden sm:block">{userEmail} ({subscriptionPlan?.toUpperCase() || 'FREE'})</span>
              <button onClick={logout} className="btn-secondary text-sm px-3 py-1 flex items-center">
                <FaSignOutAlt className="mr-1" /> Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm px-3 py-1 flex items-center">
              <FaSignInAlt className="mr-1" /> Entrar
            </Link>
          )}

          <button className="text-primary-600 hover:text-accent transition duration-300">
            <FaSearch className="text-xl" />
          </button>
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center space-x-1 text-primary-600 hover:text-accent-DEFAULT transition duration-300 group">
    {icon}
    <span className="hidden md:block text-sm font-medium group-hover:text-accent-dark">{label}</span>
  </Link>
);

export default Header;
