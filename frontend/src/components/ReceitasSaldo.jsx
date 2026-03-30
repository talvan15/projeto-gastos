import "./ReceitasSaldo.css";

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ReceitasSaldo({ indicadores, loading }) {
  return (
    <div className="receitas-saldo">
      <div className="info-box receitas">
        {loading ? (
          <div className="skeleton-text" />
        ) : (
          <>
            <span className="label">Receitas</span>
            <span className="valor">
              {fmt(indicadores?.receitas.valor ?? 0)}
            </span>
          </>
        )}
      </div>
      <div className="info-box saldo">
        {loading ? (
          <div className="skeleton-text" />
        ) : (
          <>
            <span className="label">Saldo</span>
            <span
              className={`valor ${indicadores?.saldo.valor >= 0 ? "positivo" : "negativo"}`}
            >
              {fmt(indicadores?.saldo.valor ?? 0)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
