import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIndicadores } from '../services/api';
import Modal from '../components/Modal';
import './Home.css';

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Home() {
  const navigate = useNavigate();
  const [indicadores, setIndicadores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarIndicadores = useCallback(async () => {
    try {
      const data = await getIndicadores();
      setIndicadores(data);
    } catch (e) {
      console.error('Erro ao carregar indicadores', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarIndicadores(); }, [carregarIndicadores]);

  const cards = [
    {
      label: 'Total Cadastrado',
      valor: indicadores?.total_geral.valor ?? 0,
      qtd: indicadores?.total_geral.quantidade ?? 0,
      cor: 'accent',
      filtro: '',
    },
    {
      label: 'Em Aberto',
      valor: indicadores?.em_aberto.valor ?? 0,
      qtd: indicadores?.em_aberto.quantidade ?? 0,
      cor: 'yellow',
      filtro: 'em_aberto',
    },
    {
      label: 'Pagos',
      valor: indicadores?.pagos.valor ?? 0,
      qtd: indicadores?.pagos.quantidade ?? 0,
      cor: 'green',
      filtro: 'pago',
    },
  ];

  return (
    <div className="home">
      {/* ── Header ── */}
      <header className="home-header">
        <div>
          <h1 className="home-title">Controle de <span>Gastos</span></h1>
          <p className="home-sub">Gerencie suas despesas fixas e variáveis</p>
        </div>
        <button className="btn-novo" onClick={() => setModalAberto(true)}>
          <span>+</span> Novo Lançamento
        </button>
      </header>

      {/* ── Indicadores ── */}
      <section className="indicadores">
        {loading
          ? [1, 2, 3].map(i => <div key={i} className="card-skeleton" />)
          : cards.map((c) => (
            <button
              key={c.label}
              className={`indicador-card cor-${c.cor}`}
              onClick={() => navigate(`/despesas${c.filtro ? `?status=${c.filtro}` : ''}`)}
            >
              <span className="ind-label">{c.label}</span>
              <span className="ind-valor">{fmt(c.valor)}</span>
              <span className="ind-qtd">{c.qtd} {c.qtd === 1 ? 'despesa' : 'despesas'}</span>
              <span className="ind-seta">→</span>
            </button>
          ))
        }
      </section>

      {modalAberto && (
        <Modal
          onClose={() => setModalAberto(false)}
          onSalvo={carregarIndicadores}
        />
      )}
    </div>
  );
}
