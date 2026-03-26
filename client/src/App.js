import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const apiBase = '/api/transacoes';

function App() {
  const [transacoes, setTransacoes] = useState([]);
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [form, setForm] = useState({ descricao:'', valor:'', tipo:'receita', categoria:'', data:'' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { listar(); }, []);

  async function listar() {
    try {
      const res = await fetch(apiBase);
      const data = await res.json();
      setTransacoes(Array.isArray(data) ? data : []);
      let r=0,d=0;
      data.forEach(t=>{ if(t.tipo==='receita') r+=t.valor; if(t.tipo==='despesa') d+=t.valor; });
      setReceitas(r); setDespesas(d); setSaldo(r-d);
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${apiBase}/${editId}` : apiBase;
    try {
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      if(!res.ok) throw new Error('Erro na requisição');
      setForm({ descricao:'', valor:'', tipo:'receita', categoria:'', data:'' });
      setEditId(null);
      listar();
    } catch(err){ console.error(err); }
  }

  async function handleDelete(id) {
    try { await fetch(`${apiBase}/${id}`, { method:'DELETE' }); listar(); } catch(err){ console.error(err); }
  }

  async function handleEdit(t) {
    setForm({ descricao:t.descricao, valor:t.valor, tipo:t.tipo, categoria:t.categoria, data:t.data });
    setEditId(t.id);
  }

  const categoriaData = () => {
    const cat = {};
    transacoes.forEach(t=>{ if(!cat[t.categoria]) cat[t.categoria]=0; cat[t.categoria]+=t.valor; });
    return { labels:Object.keys(cat), datasets:[{ label:'Valores por Categoria', data:Object.values(cat), backgroundColor:['#f87171','#60a5fa','#34d399','#fbbf24','#a78bfa','#f472b6'] }]};
  };

  const saldoData = {
    labels:['Receitas','Despesas','Saldo'],
    datasets:[{ label:'Resumo Financeiro', data:[receitas,despesas,saldo], backgroundColor:['#34d399','#f87171','#60a5fa'] }]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Dashboard Financeiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h2 className="font-semibold text-green-700">Receitas</h2>
          <p className="text-2xl font-bold">R$ {receitas.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <h2 className="font-semibold text-red-700">Despesas</h2>
          <p className="text-2xl font-bold">R$ {despesas.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="font-semibold text-blue-700">Saldo</h2>
          <p className="text-2xl font-bold">R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-10 grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-4 rounded shadow">
        <input type="text" placeholder="Descrição" value={form.descricao} onChange={e=>setForm({...form, descricao:e.target.value})} className="border p-2 rounded col-span-2"/>
        <input type="number" placeholder="Valor" value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})} className="border p-2 rounded"/>
        <select value={form.tipo} onChange={e=>setForm({...form, tipo:e.target.value})} className="border p-2 rounded">
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
        <input type="text" placeholder="Categoria" value={form.categoria} onChange={e=>setForm({...form, categoria:e.target.value})} className="border p-2 rounded"/>
        <input type="date" value={form.data} onChange={e=>setForm({...form, data:e.target.value})} className="border p-2 rounded"/>
        <button type="submit" className="bg-indigo-600 text-white p-2 rounded">{editId ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Saldo, Receitas e Despesas</h3>
          <Bar data={saldoData} options={{ responsive:true, plugins:{legend:{position:'top'}}}}/>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Valores por Categoria</h3>
          <Pie data={categoriaData()} options={{ responsive:true, plugins:{legend:{position:'right'}}}}/>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Transações Recentes</h3>
        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {transacoes.map(t=>(
            <li key={t.id} className="py-2 flex justify-between">
              <div>
                <span className="font-semibold">{t.descricao}</span> - {t.categoria} ({t.tipo})
              </div>
              <div className="flex gap-2">
                <span className={t.tipo==='receita'?'text-green-600':'text-red-600'}>R$ {t.valor.toFixed(2)}</span>
                <button onClick={()=>handleEdit(t)} className="text-blue-600">Editar</button>
                <button onClick={()=>handleDelete(t.id)} className="text-red-600">Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;