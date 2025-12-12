import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaFacebook, FaGoogle, FaApple } from 'react-icons/fa';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'PARTICIPANTE',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, fullName, password, confirmPassword, role } = formData;

    if (!email || !fullName || !password || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('A senha e a confirmação de senha não coincidem.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userData = {
        email,
        fullName,
        password,
        role: role === 'ORGANIZADOR' ? 'ADMIN' : 'PARTICIPANTE',
      };

      await register(userData);
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.message || 'Falha no cadastro. Verifique os dados.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFE9E0] p-4 font-sans">
      {/* Container Principal */}
      <div className="relative bg-white pt-10 pb-12 px-12 rounded-[50px] border-2 border-black w-full max-w-2xl shadow-sm">

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
        <h1 className="text-center text-[#8AC9D3] text-6xl font-bold mb-8 tracking-wide">
          Cadastro
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">

          {/* E-mail */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className="w-full h-12 px-4 rounded-xl border-2 border-black text-lg outline-none focus:ring-2 focus:ring-[#8AC9D3]/50 placeholder-gray-400"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          {/* Nome Completo */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">Nome Completo</label>
            <input
              type="text"
              name="fullName"
              placeholder="Nome completo"
              className="w-full h-12 px-4 rounded-xl border-2 border-black text-lg outline-none focus:ring-2 focus:ring-[#8AC9D3]/50 placeholder-gray-400"
              onChange={handleChange}
              value={formData.fullName}
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              className="w-full h-12 px-4 rounded-xl border-2 border-black text-lg outline-none focus:ring-2 focus:ring-[#8AC9D3]/50 placeholder-gray-400"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">Confirme sua senha</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Senha"
              className="w-full h-12 px-4 rounded-xl border-2 border-black text-lg outline-none focus:ring-2 focus:ring-[#8AC9D3]/50 placeholder-gray-400"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />
          </div>

          {/* Mensagem de Erro */}
          {error && <p className="text-red-500 font-bold text-center bg-red-50 p-2 rounded-lg border-2 border-red-200">{error}</p>}

          {/* Seletor de ROLE (Participante/Organizador) */}
          <div>
            <span className="block text-xl font-bold mb-2 text-black">Eu sou:</span>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center cursor-pointer p-3 rounded-xl border-2 border-black transition font-bold ${formData.role === 'PARTICIPANTE' ? 'bg-[#AEE2EA]' : 'bg-white hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="role"
                  value="PARTICIPANTE"
                  checked={formData.role === 'PARTICIPANTE'}
                  onChange={handleChange}
                  className="hidden"
                />
                Participante
              </label>
              <label className={`flex-1 flex items-center justify-center cursor-pointer p-3 rounded-xl border-2 border-black transition font-bold ${formData.role === 'ORGANIZADOR' ? 'bg-[#AEE2EA]' : 'bg-white hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="role"
                  value="ORGANIZADOR"
                  checked={formData.role === 'ORGANIZADOR'}
                  onChange={handleChange}
                  className="hidden"
                />
                Organizador
              </label>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col items-center gap-2 mt-4">

            <div className="flex gap-4 w-full">
              {/* Botão Cadastrar */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#AEE2EA] border-2 border-black h-12 rounded-full text-lg font-bold text-black hover:bg-[#9ddce6] transition shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </button>

              {/* Botão Login (fake button style link) */}
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center bg-[#AEE2EA] border-2 border-black h-12 rounded-full text-lg font-bold text-black hover:bg-[#9ddce6] transition shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
              >
                Login
              </Link>
            </div>

            <span className="text-sm font-bold text-black -mt-8 mb-6 z-10 bg-white px-2 relative" style={{ top: '-32px', display: 'none' }}>Já tem conta?</span>
          </div>



        </form>
      </div>
    </div>
  );
};

export default Register;