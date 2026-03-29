import { useState, useEffect } from 'react';
import { criarLancamento, editarLancamento } from '../services/api';
import './Modal.css';

const CATEGORIAS = [
  'Moradia',
  'Alimentação',
  'Saúde',
  'Transporte',
  'Educação',
  'Lazer',
  'Serviços',
  'Outros'
];

export default function Modal({ despesa, onClose, onSalvo }) {
  const editando = Boolean(despesa);

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    status: 'em_aberto',
    categoria: 'Outros',
    data_lancamento: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (despesa) {
      setForm({
        descricao: despesa.descricao || '',
        valor: despesa.valor || '',
        tipo: despesa.tipo || 'despesa',
        status: despesa.status || 'em_aberto',
        categoria: despesa.categoria || 'Outros',
        data_lancamento:
          despesa.data_lancamento || new Date().toISOString().split('T')[0],
      });
    }
  }, [despesa]);

  const handle = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const atualizado = { ...prev, [name]: value };

      if (name === 'tipo') {
        if (value === 'receita') {
          atualizado.status = '';
          atualizado.categoria = '';
        } else {
          if (!prev.status) atualizado.status = 'em_aberto';
          if (!prev.categoria) atualizado.categoria = 'Outros';
          if (!prev.data_lancamento) {
            atualizado.data_lancamento = new Date().toISOString().split('T')[0];
          }
        }
      }

      return atualizado;
    });
  };

  const salvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const payload = {
        descricao: form.descricao,
        valor: form.valor,
        tipo: form.tipo,
        data_lancamento: form.data_lancamento,
      };

      if (form.tipo === 'despesa') {
        payload.status = form.status;
        payload.categoria = form.categoria;
        payload.data_lancamento = form.data_lancamento;
      }

      if (editando) {
        await editarLancamento(despesa.id, payload);
      } else {
        await criarLancamento(payload);
      }

      onSalvo();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        err.response?.data?.detail ||
        'Erro ao salvar lançamento.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editando ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {erro && <div className="modal-erro">{erro}</div>}

        <form onSubmit={salvar} className="modal-form">
          <div className="field">
            <label>Descrição</label>
            <input
              name="descricao"
              value={form.descricao}
              onChange={handle}
              placeholder="Ex: Conta de luz"
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Valor (R$)</label>
              <input
                name="valor"
                type="number"
                step="0.01"
                min="0.01"
                value={form.valor}
                onChange={handle}
                placeholder="0,00"
                required
              />
            </div>

            
              <div className="field">
                <label>Data de Lançamento</label>
                <input
                  name="data_lancamento"
                  type="date"
                  value={form.data_lancamento}
                  onChange={handle}
                  required
                />
              </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handle}>
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </select>
            </div>

            {form.tipo === 'despesa' && (
              <div className="field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handle}>
                  <option value="em_aberto">Em Aberto</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
            )}
          </div>

          {form.tipo === 'despesa' && (
            <div className="field">
              <label>Categoria</label>
              <select name="categoria" value={form.categoria} onChange={handle}>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="btn-salvar" disabled={loading}>
              {loading
                ? 'Salvando...'
                : editando
                  ? 'Salvar Alterações'
                  : 'Adicionar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}