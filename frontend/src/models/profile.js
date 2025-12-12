// src/api/profile.js (MODEL)

import api from './api';

const PROFILE_PATH = 'profile'; // Assumindo que o endpoint para o próprio perfil é /api/profile

// === GET USER PROFILE ===
export const getMyProfile = async () => {
  try {
    // Retorna os dados do usuário logado (Nome, Email, Role, etc.)
    const response = await api.get(`/${PROFILE_PATH}`); 
    return response.data; 
  } catch (error) {
    throw error.response?.data || new Error("Erro ao carregar seu perfil.");
  }
};

// === UPDATE USER PROFILE (Dados Pessoais) ===
export const updateMyProfile = async (profileData) => {
  try {
    // Atualiza Nome, Email, etc.
    const response = await api.put(`/${PROFILE_PATH}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao atualizar perfil.");
  }
};

// === UPDATE USER PASSWORD ===
export const updateMyPassword = async (passwordData) => {
  try {
    // passwordData = { oldPassword, newPassword }
    const response = await api.put(`/${PROFILE_PATH}/password`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao alterar senha. Verifique a senha antiga.");
  }
};