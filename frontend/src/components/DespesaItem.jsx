import './DespesaItem.css';

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmtData = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');

export default function DespesaItem({ despesa, onEditar, onExcluir }) {
  const emAberto = despesa.status === 'em_aberto';

  return (
    <div className={`despesa-item animate-in ${despesa.status}`}>
      <div className="despesa-left">
        <span className={`status-dot ${despesa.status}`} />
        <div className="despesa-info">
          <span className="despesa-desc">{despesa.descricao}</span>
          <div className="despesa-meta">
            <span className="badge tipo">{despesa.tipo_display}</span>
            {despesa.categoria && (
              <span className="badge cat">{despesa.categoria}</span>
            )}
            <span className="despesa-data">venc. {fmtData(despesa.data_vencimento)}</span>
          </div>
        </div>
      </div>

      <div className="despesa-right">
        <span className="despesa-valor">{fmt(despesa.valor)}</span>
        {emAberto && (
          <div className="despesa-acoes">
            <button
              className="btn-acao editar"
              onClick={() => onEditar(despesa)}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className="btn-acao excluir"
              onClick={() => onExcluir(despesa)}
              title="Excluir"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
