
import React from 'react';
import { Link } from 'react-router-dom';
import logoLampi from "../../../assets/logo_lampi.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#EFE9E0] flex items-center justify-center p-4">
      {/* Card Central */}
      <div className="bg-white rounded-[40px] p-12 w-full max-w-2xl shadow-sm text-center flex flex-col items-center border-2 border-black">

        {/* Logo Lampi (PNG) - Cortada via CSS para remover texto */}
        <div className="mb-6">
          <img
            src={logoLampi}
            alt="Logo Lampi"
            className="w-48 h-36 object-cover object-top mx-auto"
            title="Logo Lampi"
          />
        </div>

        {/* Título */}
        <h1 className="text-[#589CA8] text-4xl font-bold mb-2 tracking-wide font-sans">
          Bem Vindo(A)!
        </h1>

        {/* Subtítulo */}
        <p className="text-[#589CA8] text-lg mb-12 font-medium">
          Fique por dentro de<br />
          tudo sobre o LAMPI.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-6 w-full px-8">
          <Link
            to="/login"
            className="flex-1 bg-[#E0F5F8] border-2 border-black text-[#589CA8] text-center py-3 rounded-2xl font-bold hover:bg-[#589CA8] hover:text-white transition duration-300 shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
          >
            Login
          </Link>

          <Link
            to="/cadastro"
            className="flex-1 bg-[#E0F5F8] border-2 border-black text-[#589CA8] text-center py-3 rounded-2xl font-bold hover:bg-[#589CA8] hover:text-white transition duration-300 shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
          >
            Cadastrar
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;