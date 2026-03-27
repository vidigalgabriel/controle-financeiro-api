import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const apiBase = '/api/transacoes';

function App() {
  const [transacoes, setTransacoes] = useState([]);
  const [buscaId, setBuscaId] = useState('');
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [form, setForm] = useState({ descricao:'', valor:'', tipo:'receita', categoria:'', data:'' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { listar(); }, []);

  async function listar() {
    const res = await fetch(apiBase);
    const data = await res.json();
    setTransacoes(Array.isArray(data) ? data : []);
    let r=0,d=0;
    data.forEach(t=>{ if(t.tipo==='receita') r+=t.valor; if(t.tipo==='despesa') d+=t.valor; });
    setReceitas(r); setDespesas(d); setSaldo(r-d);
  }

  async function buscarPorId() {
    if(!buscaId) return listar();
    const res = await fetch(`${apiBase}/${buscaId}`);
    const data = await res.json();
    setTransacoes(data ? [data] : []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${apiBase}/${editId}` : apiBase;
    await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setForm({ descricao:'', valor:'', tipo:'receita', categoria:'', data:'' });
    setEditId(null);
    listar();
  }

  async function handleDelete(id) {
    await fetch(`${apiBase}/${id}`, { method:'DELETE' });
    listar();
  }

  function handleEdit(t) {
    setForm(t);
    setEditId(t.id);
  }

  const categoriaData = () => {
    const cat = {};
    transacoes.forEach(t=>{ cat[t.categoria]=(cat[t.categoria]||0)+t.valor; });
    return { labels:Object.keys(cat), datasets:[{ data:Object.values(cat) }]};
  };

  const saldoData = {
    labels:['Receitas','Despesas','Saldo'],
    datasets:[{ data:[receitas,despesas,saldo] }]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl font-bold mb-6">Controle Financeiro</h1>

      {/* RESUMO */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Receitas: R$ {receitas.toFixed(2)}</div>
        <div className="bg-white p-4 rounded shadow">Despesas: R$ {despesas.toFixed(2)}</div>
        <div className="bg-white p-4 rounded shadow">Saldo: R$ {saldo.toFixed(2)}</div>
      </div>

      {/* FORM + BUSCA */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold">{editId ? 'Editar' : 'Nova Transação'}</h2>
          <input placeholder="Descrição" value={form.descricao} onChange={e=>setForm({...form, descricao:e.target.value})} className="w-full border p-2"/>
          <input type="number" placeholder="Valor" value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})} className="w-full border p-2"/>
          <select value={form.tipo} onChange={e=>setForm({...form, tipo:e.target.value})} className="w-full border p-2">
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          <input placeholder="Categoria" value={form.categoria} onChange={e=>setForm({...form, categoria:e.target.value})} className="w-full border p-2"/>
          <input type="date" value={form.data} onChange={e=>setForm({...form, data:e.target.value})} className="w-full border p-2"/>
          <button className="w-full bg-indigo-600 text-white p-2">{editId ? 'Atualizar' : 'Adicionar'}</button>
        </form>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Buscar por ID</h2>
          <input value={buscaId} onChange={e=>setBuscaId(e.target.value)} placeholder="Digite o ID" className="border p-2 w-full mb-2"/>
          <button onClick={buscarPorId} className="w-full bg-gray-800 text-white p-2">Buscar</button>
          <button onClick={listar} className="w-full mt-2 border p-2">Resetar</button>
        </div>

      </div>

      {/* GRÁFICOS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow"><Bar data={saldoData}/></div>
        <div className="bg-white p-4 rounded shadow"><Pie data={categoriaData()}/></div>
      </div>

      {/* LISTA */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Transações</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Desc</th><th>Cat</th><th>Tipo</th><th>Valor</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map(t=>(
              <tr key={t.id} className="border-b text-center">
                <td>{t.descricao}</td>
                <td>{t.categoria}</td>
                <td>{t.tipo}</td>
                <td>R$ {t.valor}</td>
                <td className="space-x-2">
                  <button onClick={()=>handleEdit(t)}>✏️</button>
                  <button onClick={()=>handleDelete(t.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;