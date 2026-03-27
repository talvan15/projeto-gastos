import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDespesas, getIndicadores, excluirDespesa } from '../services/api';
import DespesaItem from '../components/DespesaItem';
import FiltroMes from '../components/FiltroMes';
import Modal from '../components/Modal';
import './ListaDespesas.css';

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_LABELS = {
  '': 'Todas as Despesas',
  'em_aberto': 'Em Aberto',
  'pago': 'Pagas',
};

export default function ListaDespesas() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const statusFiltro = params.get('status') || '';

  const agora = new Date();
  const [filtro, setFiltro] = useState({
    mes: agora.getMonth() + 1,
    ano: agora.getFullYear(),
  });

  const [despesas, setDespesas] = useState([]);
  const [indicadores, setIndicadores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [despesaEditando, setDespesaEditando] = useState(null);
  const [confirmExcluir, setConfirmExcluir] = useState(null);
  const [erroExcluir, setErroExcluir] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        mes: filtro.mes,
        ano: filtro.ano,
        ...(statusFiltro && { status: statusFiltro }),
      };
      const [listData, indData] = await Promise.all([
        getDespesas(queryParams),
        getIndicadores({ mes: filtro.mes, ano: filtro.ano }),
      ]);
      setDespesas(listData.results ?? listData);
      setIndicadores(indData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filtro, statusFiltro]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleEditar = (despesa) => {
    setDespesaEditando(despesa);
    setModalAberto(true);
  };

  const handleExcluir = async () => {
    try {
      await excluirDespesa(confirmExcluir.id);
      setConfirmExcluir(null);
      carregar();
    } catch (e) {
      setErroExcluir(
        e.response?.data?.erro || 'Erro ao excluir despesa.'
      );
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setDespesaEditando(null);
  };

  // Agrupa despesas por status para exibição
  const emAberto = despesas.filter(d => d.status === 'em_aberto');
  const pagas = despesas.filter(d => d.status === 'pago');

  return (
    <div className="lista-page">
      {/* ── Header ── */}
      <div className="lista-header">
        <div className="lista-nav">
          <button className="btn-voltar" onClick={() => navigate('/')}>← Voltar</button>
          <h1>{STATUS_LABELS[statusFiltro]}</h1>
        </div>
        <button className="btn-novo-sm" onClick={() => { setDespesaEditando(null); setModalAberto(true); }}>
          + Nova
        </button>
      </div>

      {/* ── Mini Indicadores ── */}
      {indicadores && (
        <div className="mini-indicadores">
          <div className="mini-ind">
            <span className="mi-label">Total</span>
            <span className="mi-val">{fmt(indicadores.total_geral.valor)}</span>
          </div>
          <div className="mini-ind yellow">
            <span className="mi-label">Em Aberto</span>
            <span className="mi-val">{fmt(indicadores.em_aberto.valor)}</span>
          </div>
          <div className="mini-ind green">
            <span className="mi-label">Pagos</span>
            <span className="mi-val">{fmt(indicadores.pagos.valor)}</span>
          </div>
        </div>
      )}

      {/* ── Filtros ── */}
      <div className="lista-filtros">
        <FiltroMes
          mes={filtro.mes}
          ano={filtro.ano}
          onChange={({ mes, ano }) => setFiltro({ mes, ano })}
        />
        <div className="filtro-status">
          {['', 'em_aberto', 'pago'].map(s => (
            <button
              key={s}
              className={`tab ${statusFiltro === s ? 'ativo' : ''}`}
              onClick={() => navigate(`/despesas${s ? `?status=${s}` : ''}`)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lista ── */}
      {loading ? (
        <div className="loading-state">
          {[1,2,3,4].map(i => <div key={i} className="item-skeleton" />)}
        </div>
      ) : despesas.length === 0 ? (
        <div className="empty-state">
          <span>📭</span>
          <p>Nenhuma despesa encontrada para este período.</p>
        </div>
      ) : (
        <div className="grupos">
          {/* Em Aberto */}
          {(statusFiltro === '' || statusFiltro === 'em_aberto') && emAberto.length > 0 && (
            <div className="grupo">
              <div className="grupo-header yellow">
                <span className="grupo-dot" />
                <span>Em Aberto</span>
                <span className="grupo-total">{fmt(emAberto.reduce((s, d) => s + +d.valor, 0))}</span>
              </div>
              <div className="grupo-lista">
                {emAberto.map(d => (
                  <DespesaItem
                    key={d.id}
                    despesa={d}
                    onEditar={handleEditar}
                    onExcluir={setConfirmExcluir}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pagas */}
          {(statusFiltro === '' || statusFiltro === 'pago') && pagas.length > 0 && (
            <div className="grupo">
              <div className="grupo-header green">
                <span className="grupo-dot" />
                <span>Pagas</span>
                <span className="grupo-total">{fmt(pagas.reduce((s, d) => s + +d.valor, 0))}</span>
              </div>
              <div className="grupo-lista">
                {pagas.map(d => (
                  <DespesaItem
                    key={d.id}
                    despesa={d}
                    onEditar={handleEditar}
                    onExcluir={setConfirmExcluir}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modal Criar/Editar ── */}
      {modalAberto && (
        <Modal
          despesa={despesaEditando}
          onClose={fecharModal}
          onSalvo={carregar}
        />
      )}

      {/* ── Confirmação Excluir ── */}
      {confirmExcluir && (
        <div className="modal-overlay" onClick={() => { setConfirmExcluir(null); setErroExcluir(null); }}>
          <div className="confirm-box animate-in" onClick={e => e.stopPropagation()}>
            <h3>Excluir Despesa</h3>
            <p>Tem certeza que deseja excluir <strong>"{confirmExcluir.descricao}"</strong>?</p>
            {erroExcluir && <div className="confirm-erro">{erroExcluir}</div>}
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => { setConfirmExcluir(null); setErroExcluir(null); }}>
                Cancelar
              </button>
              <button className="btn-excluir" onClick={handleExcluir}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
