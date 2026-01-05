import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FaExclamationTriangle className="text-danger text-6xl mb-6" />
      <h1 className="header-text text-primary-900 mb-4">Página Não Encontrada</h1>
      <p className="sub-header-text text-primary-600 mb-8">
        Parece que você se desviou do caminho.
      </p>
      <Link to="/" className="btn-primary text-lg">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default NotFoundPage;
