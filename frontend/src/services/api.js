import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const getLancamentos = (params = {}) =>
  api.get('/lancamentos/', { params }).then(r => r.data);

export const getLancamento = (id) =>
  api.get(`/lancamentos/${id}/`).then(r => r.data);

export const criarLancamento = (dados) =>
  api.post('/lancamentos/', dados).then(r => r.data);

export const editarLancamento = (id, dados) =>
  api.patch(`/lancamentos/${id}/`, dados).then(r => r.data);

export const pagarLancamento = (id) =>
  api.patch(`/lancamentos/${id}/pagar/`).then(r => r.data);

export const excluirLancamento = (id) =>
  api.delete(`/lancamentos/${id}/`);

export const getIndicadores = (params = {}) =>
  api.get('/lancamentos/indicadores/', { params }).then(r => r.data);

export default api;