import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lampi-offwhite text-center p-8">
      <h1 className="text-9xl font-bold text-red-500 mb-4 drop-shadow-md">404</h1>
      <h2 className="text-3xl font-bold text-lampi-dark mb-4">Ops! Página não encontrada :(</h2>
      <p className="text-xl text-gray-500 mb-8 max-w-md">
        Parece que você tentou acessar uma rota que não existe ou foi removida.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-lampi-green hover:bg-lampi-dark text-white font-bold rounded-lg transition duration-200 shadow-md transform hover:-translate-y-1"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default NotFound;