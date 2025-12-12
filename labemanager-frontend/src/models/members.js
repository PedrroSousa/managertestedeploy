// src/api/members.js (MODEL)

import api from './api';

// Funções de Leitura (READ)
export const getAllMembers = async () => {
  try {
    // Busca uma lista unificada de pessoas, que o service do backend deve segregar
    const response = await api.get('/pessoas'); 
    return response.data; // Espera-se que retorne uma lista de { id, nome, email, role, ... }
  } catch (error) {
    throw error.response?.data || new Error("Erro ao carregar membros.");
  }
};

// Funções CRUD (CREATE, UPDATE, DELETE) - Apenas para ADMIN
export const addMember = async (memberData) => {
  try {
    // Envia novos dados de membro (Aluno ou Professor)
    const response = await api.post('/pessoas', memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao cadastrar membro.");
  }
};

export const updateMember = async (memberId, memberData) => {
  try {
    const response = await api.put(`/pessoas/${memberId}`, memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao editar membro.");
  }
};

export const deleteMember = async (memberId) => {
  try {
    const response = await api.delete(`/pessoas/${memberId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao excluir membro.");
  }
};