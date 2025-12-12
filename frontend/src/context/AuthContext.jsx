// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, registerUser } from "../models/auth";
import { useNavigate } from 'react-router-dom';

// O contexto que será consumido pelos componentes
export const AuthContext = createContext();

// Hook customizado para facilitar o consumo do contexto
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Checa se o token e a role existem no localStorage ao carregar a aplicação
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
    }
    setIsLoading(false);
  }, []);

  // Função de Login
  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password); // Chama o Model

      if (!data) {
        throw new Error('Resposta inválida do servidor.');
      }

      const { token: receivedToken, role: receivedRole } = data; // Assumindo que o backend retorna { token, role }

      if (!receivedToken) {
        throw new Error('Token não recebido.');
      }

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('role', receivedRole);

      setToken(receivedToken);
      setUserRole(receivedRole);

      navigate('/dashboard'); // Redireciona para a área restrita
      return true;
    } catch (error) {
      console.error("Login falhou:", error);
      // Retorna a mensagem de erro para ser exibida no Login.js
      throw error;
    }
  };

  // Função de Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUserRole(null);
    navigate('/login');
  };

  // Função de Cadastro
  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      // Após cadastro bem-sucedido, pode-se logar automaticamente
      // Ou redirecionar para a página de login
      navigate('/login');
      return data;
    } catch (error) {
      throw error;
    }
  };


  const isAdmin = userRole === 'ADMIN';
  const isAuthenticated = !!token; // Retorna true se houver token

  const value = {
    token,
    userRole,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    logout,
    register,
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Tela de carregamento enquanto verifica o token
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};