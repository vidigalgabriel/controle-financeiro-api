// client/src/api.js
export const apiBase = '/api/transacoes';

export async function listarTransacoes() {
  const res = await fetch(apiBase);
  return res.json();
}

export async function criarTransacao(transacao) {
  const res = await fetch(apiBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transacao),
  });
  return res.json();
}