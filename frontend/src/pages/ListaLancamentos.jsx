import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getLancamentos, getIndicadores, excluirLancamento, pagarLancamento} from '../services/api';
import LancamentoItem from '../components/LancamentoItem';
import FiltroMes from '../components/FiltroMes';
import Modal from '../components/Modal';
import './ListaLancamentos.css';

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_LABELS = {
  '': 'Todas as Despesas',
  'em_aberto': 'Em Aberto',
  'pago': 'Pagas',
};

export default function ListaLancamentos() {
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
        getLancamentos(queryParams),
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

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleEditar = (despesa) => {
    setDespesaEditando(despesa);
    setModalAberto(true);
  };

  const handlePagar = async (despesa) => {
    try {
      await pagarLancamento(despesa.id);
      await carregar();
    } catch (e) {
      console.error('Erro ao pagar lançamento:', e);
    }
  };

  const handleExcluir = async () => {
    try {
      await excluirLancamento(confirmExcluir.id);
      setConfirmExcluir(null);
      setErroExcluir(null);
      await carregar();
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

  const emAberto = despesas.filter(d => d.status === 'em_aberto');
  const pagas = despesas.filter(d => d.status === 'pago');

  const saldo = indicadores
   ? (indicadores.receitas?.valor || 0)- (indicadores.pagos?.valor || 0)
   :0;

  const comprometido = indicadores
  ? indicadores.em_aberto.valor
  :0;

  return (
    <div className="lista-page">
      <div className="lista-header">
        <div className="lista-nav">
          <button className="btn-voltar" onClick={() => navigate('/')}>← Voltar</button>
          <h1>{STATUS_LABELS[statusFiltro]}</h1>
        </div>
        <button
          className="btn-novo-sm"
          onClick={() => {
            setDespesaEditando(null);
            setModalAberto(true);
          }}
        >
          + Nova
        </button>
      </div>

     {indicadores && (
  <>
    <div className="mini-indicadores">
      <div
        className="mini-ind"
        onClick={() => navigate('/lancamentos')}
      >
        <span className="mi-label">Total</span>
        <span className="mi-val">
          {fmt(indicadores?.total_geral?.valor || 0)}
        </span>
      </div>

      <div
        className="mini-ind green"
        onClick={() => navigate('/lancamentos?status=pago')}
      >
        <span className="mi-label">Pagos</span>
        <span className="mi-val">
          {fmt(indicadores?.pagos?.valor || 0)}
        </span>
      </div>
    </div>

    <div className="mini-indicadores">
      <div className="mini-ind blue">
        <span className="mi-label">Saldo</span>
        <span className="mi-val">{fmt(saldo)}</span>
      </div>

      <div className="mini-ind red">
        <span className="mi-label">Comprometido</span>
        <span className="mi-val">{fmt(comprometido)}</span>
      </div>
    </div>
  </>
)}

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

      {loading ? (
        <div className="loading-state">
          {[1, 2, 3, 4].map(i => <div key={i} className="item-skeleton" />)}
        </div>
      ) : despesas.length === 0 ? (
        <div className="empty-state">
          <span>📭</span>
          <p>Nenhuma despesa encontrada para este período.</p>
        </div>
      ) : (
        <div className="grupos">
          {(statusFiltro === '' || statusFiltro === 'em_aberto') && emAberto.length > 0 && (
            <div className="grupo">
              <div className="grupo-header yellow">
                <span className="grupo-dot" />
                <span>Em Aberto</span>
                <span className="grupo-total">
                  {fmt(emAberto.reduce((s, d) => s + +d.valor, 0))}
                </span>
              </div>
              <div className="grupo-lista">
                {emAberto.map(d => (
                  <LancamentoItem
                    key={d.id}
                    despesa={d}
                    onEditar={handleEditar}
                    onExcluir={setConfirmExcluir}
                    onPagar={handlePagar}
                  />
                ))}
              </div>
            </div>
          )}

          {(statusFiltro === '' || statusFiltro === 'pago') && pagas.length > 0 && (
            <div className="grupo">
              <div className="grupo-header green">
                <span className="grupo-dot" />
                <span>Pagas</span>
                <span className="grupo-total">
                  {fmt(pagas.reduce((s, d) => s + +d.valor, 0))}
                </span>
              </div>
              <div className="grupo-lista">
                {pagas.map(d => (
                  <LancamentoItem
                    key={d.id}
                    despesa={d}
                    onEditar={handleEditar}
                    onExcluir={setConfirmExcluir}
                    onPagar={handlePagar}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {modalAberto && (
        <Modal
          despesa={despesaEditando}
          onClose={fecharModal}
          onSalvo={carregar}
        />
      )}

      {confirmExcluir && (
        <div
          className="modal-overlay"
          onClick={() => {
            setConfirmExcluir(null);
            setErroExcluir(null);
          }}
        >
          <div className="confirm-box animate-in" onClick={e => e.stopPropagation()}>
            <h3>Excluir Despesa</h3>
            <p>
              Tem certeza que deseja excluir <strong>"{confirmExcluir.descricao}"</strong>?
            </p>
            {erroExcluir && <div className="confirm-erro">{erroExcluir}</div>}
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setConfirmExcluir(null);
                  setErroExcluir(null);
                }}
              >
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