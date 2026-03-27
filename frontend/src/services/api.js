import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Despesas ────────────────────────────────────────────────────────────────

export const getDespesas = (params = {}) =>
  api.get('/despesas/', { params }).then(r => r.data);

export const getDespesa = (id) =>
  api.get(`/despesas/${id}/`).then(r => r.data);

export const criarDespesa = (dados) =>
  api.post('/despesas/', dados).then(r => r.data);

export const editarDespesa = (id, dados) =>
  api.patch(`/despesas/${id}/`, dados).then(r => r.data);

export const excluirDespesa = (id) =>
  api.delete(`/despesas/${id}/`);

// ─── Indicadores ─────────────────────────────────────────────────────────────

export const getIndicadores = (params = {}) =>
  api.get('/despesas/indicadores/', { params }).then(r => r.data);

export default api;
