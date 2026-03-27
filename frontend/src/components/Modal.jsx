import { useState, useEffect } from 'react';
import { criarDespesa, editarDespesa } from '../services/api';
import './Modal.css';

const CATEGORIAS = [
  'Moradia', 'Alimentação', 'Saúde', 'Transporte',
  'Educação', 'Lazer', 'Serviços', 'Outros'
];

export default function Modal({ despesa, onClose, onSalvo }) {
  const editando = Boolean(despesa);

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'variavel',
    status: 'em_aberto',
    categoria: 'Outros',
    data_vencimento: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (despesa) {
      setForm({
        descricao: despesa.descricao,
        valor: despesa.valor,
        tipo: despesa.tipo,
        status: despesa.status,
        categoria: despesa.categoria || 'Outros',
        data_vencimento: despesa.data_vencimento,
      });
    }
  }, [despesa]);

  const handle = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const salvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      if (editando) {
        await editarDespesa(despesa.id, form);
      } else {
        await criarDespesa(form);
      }
      onSalvo();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.erro
        || err.response?.data?.detail
        || 'Erro ao salvar despesa.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box animate-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editando ? 'Editar Despesa' : 'Nova Despesa'}</h2>
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
              <label>Vencimento</label>
              <input
                name="data_vencimento"
                type="date"
                value={form.data_vencimento}
                onChange={handle}
                required
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handle}>
                <option value="fixa">Fixa</option>
                <option value="variavel">Variável</option>
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option value="em_aberto">Em Aberto</option>
                <option value="pago">Pago</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Categoria</label>
            <select name="categoria" value={form.categoria} onChange={handle}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-salvar" disabled={loading}>
              {loading ? 'Salvando…' : editando ? 'Salvar Alterações' : 'Adicionar Despesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
