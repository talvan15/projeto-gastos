import './FiltroMes.css';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function FiltroMes({ mes, ano, onChange }) {
  const anoAtual = new Date().getFullYear();
  const anos = [anoAtual - 1, anoAtual, anoAtual + 1];

  return (
    <div className="filtro-mes">
      <select
        value={mes}
        onChange={e => onChange({ mes: e.target.value, ano })}
      >
        <option value="">Todos os meses</option>
        {MESES.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>
      <select
        value={ano}
        onChange={e => onChange({ mes, ano: e.target.value })}
      >
        {anos.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
  );
}
