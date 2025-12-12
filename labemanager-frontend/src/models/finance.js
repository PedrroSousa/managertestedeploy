// src/api/finance.js (MODEL)

import api from './api';

const FINANCE_PATH = 'finance';

// === GET ALL TRANSACTIONS ===
export const getAllTransactions = async () => {
  try {
    const response = await api.get(`/${FINANCE_PATH}/transactions`); 
    return response.data; // Espera-se uma lista de { id, tipo, valor, descricao, data }
  } catch (error) {
    throw error.response?.data || new Error("Erro ao carregar transações financeiras.");
  }
};

// === CRUD GENÉRICO DE TRANSAÇÕES ===

export const addTransaction = async (data) => {
  try {
    const response = await api.post(`/${FINANCE_PATH}/transactions`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao cadastrar transação.");
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await api.put(`/${FINANCE_PATH}/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao editar transação.");
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/${FINANCE_PATH}/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao excluir transação.");
  }
};