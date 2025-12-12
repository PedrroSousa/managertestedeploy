// src/api/inventory.js (MODEL)

import api from './api';

// --- ENTIDADES GENÉRICAS ---
// Usaremos uma função genérica para simplificar o código, assumindo que as rotas seguem o padrão /api/{entidade}

const createCrud = (entityPath) => ({
  getAll: async () => {
    try {
      const response = await api.get(`/${entityPath}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error(`Erro ao carregar ${entityPath}.`);
    }
  },
  add: async (data) => {
    try {
      const response = await api.post(`/${entityPath}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error(`Erro ao cadastrar ${entityPath}.`);
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/${entityPath}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error(`Erro ao editar ${entityPath}.`);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/${entityPath}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error(`Erro ao excluir ${entityPath}.`);
    }
  },
});

export const inventoryApi = createCrud('almoxarifado');
export const machinesApi = createCrud('maquinas');
// Departamentos (Logísticas)
export const departmentsApi = createCrud('departamentos');
export const projectsApi = createCrud('projetos');
export const articlesApi = createCrud('artigos');