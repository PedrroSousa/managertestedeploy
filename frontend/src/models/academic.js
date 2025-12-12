// src/api/academic.js (MODEL)

import api from './api';

// === ARTIGOS ===

export const getAllArtigos = async () => {
  try {
    const response = await api.get('/artigos');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao carregar artigos.");
  }
};

export const addArtigo = async (artigoData) => {
  try {
    const response = await api.post('/artigos', artigoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao cadastrar artigo.");
  }
};

export const updateArtigo = async (id, artigoData) => {
  try {
    const response = await api.put(`/artigos/${id}`, artigoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao editar artigo.");
  }
};

export const deleteArtigo = async (id) => {
  try {
    const response = await api.delete(`/artigos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao excluir artigo.");
  }
};

// === PROJETOS ===

export const getAllProjetos = async () => {
  try {
    const response = await api.get('/projetos');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao carregar projetos.");
  }
};

export const addProjeto = async (projetoData) => {
  try {
    const response = await api.post('/projetos', projetoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao cadastrar projeto.");
  }
};

export const updateProjeto = async (id, projetoData) => {
  try {
    const response = await api.put(`/projetos/${id}`, projetoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao editar projeto.");
  }
};

export const deleteProjeto = async (id) => {
  try {
    const response = await api.delete(`/projetos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Erro ao excluir projeto.");
  }
};