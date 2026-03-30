import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getIndicadores } from "../services/api";
import Modal from "../components/Modal";
import FiltroMes from "../components/FiltroMes";
import ReceitasSaldo from "../components/ReceitasSaldo";
import "./Home.css";

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const navigate = useNavigate();
  const [indicadores, setIndicadores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState(new Date().getFullYear());

  const carregarIndicadores = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (mes) params.mes = mes;
      if (ano) params.ano = ano;
      const data = await getIndicadores(params);
      setIndicadores(data);
    } catch (e) {
      console.error("Erro ao carregar indicadores", e);
    } finally {
      setLoading(false);
    }
  }, [mes, ano]);

  const handleFiltroChange = ({ mes: novoMes, ano: novoAno }) => {
    setMes(novoMes);
    setAno(novoAno);
  };

  useEffect(() => {
    carregarIndicadores();
  }, [carregarIndicadores]);

  const cards = [
    {
      label: "Total Cadastrado",
      valor: indicadores?.total_geral.valor ?? 0,
      qtd: indicadores?.total_geral.quantidade ?? 0,
      cor: "accent",
      filtro: "",
    },
    {
      label: "Em Aberto",
      valor: indicadores?.em_aberto.valor ?? 0,
      qtd: indicadores?.em_aberto.quantidade ?? 0,
      cor: "yellow",
      filtro: "em_aberto",
    },
    {
      label: "Pagos",
      valor: indicadores?.pagos.valor ?? 0,
      qtd: indicadores?.pagos.quantidade ?? 0,
      cor: "green",
      filtro: "pago",
    },
  ];

  return (
    <div className="home">
      {/* ── Header ── */}
      <header className="home-header">
        <div className="home-title-container">
          <h1 className="home-title">
            <span>Controle de Gastos</span>
          </h1>
          <p className="home-sub">Gerencie suas despesas fixas e variáveis</p>
        </div>
      </header>
      <div className="btn-container">
        <button className="btn-novo" onClick={() => setModalAberto(true)}>
          <span>+</span> Novo Lançamento
        </button>
        <div className="filtro-saldo-container">
          <FiltroMes mes={mes} ano={ano} onChange={handleFiltroChange} />
        </div>
      </div>

      <ReceitasSaldo indicadores={indicadores} loading={loading} />
      {/* ── Indicadores ── */}
      <span>Despesas</span>
      <section className="indicadores">
        {loading
          ? [1, 2, 3].map((i) => <div key={i} className="card-skeleton" />)
          : cards.map((c) => (
              <button
                key={c.label}
                className={`indicador-card cor-${c.cor}`}
                onClick={() =>
                  navigate(`/despesas${c.filtro ? `?status=${c.filtro}` : ""}`)
                }
              >
                <span className="ind-label">{c.label}</span>
                <span className="ind-valor">{fmt(c.valor)}</span>
                <span className="ind-qtd">
                  {c.qtd} {c.qtd === 1 ? "despesa" : "despesas"}
                </span>
                <span className="ind-seta">→</span>
              </button>
            ))}
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
