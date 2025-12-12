// src/api/auth.js

import api from './api';

export const login = async (email, password) => {
  try {
    // O backend do seu projeto (LabeManager) usa a rota /api/auth/login
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Espera-se que retorne { token, role }
  } catch (error) {
    throw error.response?.data || new Error("Erro ao realizar login.");
  }
};

export const registerUser = async (userData) => {
  try {
    // O backend do seu projeto (LabeManager) usa a rota /api/auth/register
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao realizar cadastro.");
  }
};