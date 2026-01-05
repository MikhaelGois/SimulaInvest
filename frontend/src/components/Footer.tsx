import React from 'react';
import { FaHeart, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-primary-300 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <FaHeart className="text-secondary-DEFAULT" />
          <span>Feito com fé e propósito.</span>
        </div>
        <p className="text-sm mb-2">
          &copy; {new Date().getFullYear()} SimulaInvest. Desenvolvido por <strong>Mikhael Gois</strong>. Todos os direitos reservados.
        </p>
        <p className="text-xs text-primary-400 mb-4">
          "Aquele que é fiel no pouco, também é fiel no muito." - Lucas 16:10
        </p>
        <div className="flex justify-center space-x-6">
          <a href="https://github.com/MBalieroDG" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-secondary-DEFAULT transition duration-300">
            <FaGithub className="text-2xl" />
          </a>
          <a href="https://www.linkedin.com/in/mikhael-gois-78a24225a/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-secondary-DEFAULT transition duration-300">
            <FaLinkedin className="text-2xl" />
          </a>
        </div>
        <p className="text-xs mt-4 text-primary-500">
          **Disclaimer:** Este site é para fins educacionais e de simulação. Não constitui aconselhamento financeiro.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
