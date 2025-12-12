import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      const errorMessage = err.message || 'Credenciais inválidas. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFE9E0] p-4 font-sans">
      {/* Container Principal com Borda Arredondada */}
      <div className="relative bg-white pt-12 pb-16 px-16 rounded-[50px] border-2 border-black w-full max-w-3xl shadow-sm">

        {/* Botão de Voltar (Seta) */}
        <Link
          to="/"
          className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-sm z-10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Título */}
        <h1 className="text-center text-[#8AC9D3] text-6xl font-bold mb-12 tracking-wide">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">

          {/* Campo E-mail */}
          <div>
            <label className="block text-xl font-bold mb-2 text-black">E-mail</label>
            <div className="relative">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full h-14 px-4 rounded-xl border-2 border-black text-lg outline-none focus:ring-2 focus:ring-[#8AC9D3]/50 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-xl font-bold mb-2 text-black">Senha</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Senha"
                className="w-full h-14 px-4 pr-24 rounded-xl border-2 border-black text-lg outline-none focus:ring-2 focus:ring-[#8AC9D3]/50 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Botão Esqueci */}
              <button
                type="button"
                className="absolute right-2 top-2 bottom-2 bg-black text-white px-4 rounded-lg text-sm font-bold hover:bg-gray-800 transition"
              >
                Esqueci
              </button>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && <p className="text-red-500 font-bold text-center mt-2">{error}</p>}

          {/* Botões de Ação */}
          <div className="flex gap-6 mt-12 items-end">

            {/* Botão Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#AEE2EA] border-2 border-black h-14 rounded-full text-lg font-bold text-black hover:bg-[#9ddce6] transition shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Login'}
            </button>

            {/* Container Cadastrar */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-sm font-bold mb-1 text-black">Não tem conta?</span>
              <button
                type="button"
                onClick={() => navigate('/cadastro')} // Using navigate instead of Link for button uniformity
                className="w-full bg-[#AEE2EA] border-2 border-black h-14 rounded-full text-lg font-bold text-black hover:bg-[#9ddce6] transition shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
              >
                Cadastrar
              </button>
            </div>

          </div>
        </form>

        {/* Divider ou Seção redes sociais (REMOVIDO conforme pedido) */}
        {/* <div className="mt-12 text-center text-gray-500 font-bold">Ou entre com</div> */}
        {/* Ícones de redes sociais removidos */}

      </div>
    </div>
  );
};

export default Login;