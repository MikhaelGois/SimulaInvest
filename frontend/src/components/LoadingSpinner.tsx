import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-DEFAULT"></div>
      <p className="ml-4 text-primary-600">Carregando dados com fé...</p>
    </div>
  );
};

export default LoadingSpinner;
