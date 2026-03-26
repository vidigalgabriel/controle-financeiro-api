const db = require('../database/connection');

class TransacaoService {
  criar(transacao) {
    const { descricao, valor, tipo, categoria, data } = transacao;
    if (!descricao || valor === undefined || !tipo || !categoria || !data) {
      throw new Error('Todos os campos são obrigatórios');
    }
    if (tipo !== 'receita' && tipo !== 'despesa') {
      throw new Error('Tipo deve ser "receita" ou "despesa"');
    }
    const valorNumero = Number(valor);
    if (isNaN(valorNumero) || valorNumero <= 0) {
      throw new Error('Valor deve ser um número maior que zero');
    }
    const stmt = db.prepare(`
      INSERT INTO transacoes (descricao, valor, tipo, categoria, data)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(descricao, valorNumero, tipo, categoria, data);
    return db.prepare('SELECT * FROM transacoes WHERE id = ?').get(info.lastInsertRowid);
  }

  listarTodas() {
    return db.prepare('SELECT * FROM transacoes ORDER BY data DESC').all();
  }

  buscarPorId(id) {
    const idNumero = Number(id);
    if (isNaN(idNumero)) throw new Error('ID inválido');
    const row = db.prepare('SELECT * FROM transacoes WHERE id = ?').get(idNumero);
    if (!row) throw new Error('Transação não encontrada');
    return row;
  }

  atualizar(id, transacao) {
    const idNumero = Number(id);
    if (isNaN(idNumero)) throw new Error('ID inválido');
    this.buscarPorId(idNumero);
    const { descricao, valor, tipo, categoria, data } = transacao;
    if (!descricao || valor === undefined || !tipo || !categoria || !data) {
      throw new Error('Todos os campos são obrigatórios');
    }
    if (tipo !== 'receita' && tipo !== 'despesa') {
      throw new Error('Tipo deve ser "receita" ou "despesa"');
    }
    const valorNumero = Number(valor);
    if (isNaN(valorNumero) || valorNumero <= 0) {
      throw new Error('Valor deve ser um número maior que zero');
    }
    const stmt = db.prepare(`
      UPDATE transacoes
      SET descricao = ?, valor = ?, tipo = ?, categoria = ?, data = ?
      WHERE id = ?
    `);
    stmt.run(descricao, valorNumero, tipo, categoria, data, idNumero);
    return this.buscarPorId(idNumero);
  }

  deletar(id) {
    const idNumero = Number(id);
    if (isNaN(idNumero)) throw new Error('ID inválido');
    this.buscarPorId(idNumero);
    db.prepare('DELETE FROM transacoes WHERE id = ?').run(idNumero);
    return { mensagem: 'Transação deletada com sucesso' };
  }

  obterResumo() {
    const resultados = db.prepare(`
      SELECT tipo, SUM(valor) as total
      FROM transacoes
      GROUP BY tipo
    `).all();
    let receitas = 0;
    let despesas = 0;
    resultados.forEach(r => {
      if (r.tipo === 'receita') receitas = Number(r.total);
      if (r.tipo === 'despesa') despesas = Number(r.total);
    });
    return { receitas, despesas, saldo: receitas - despesas };
  }

  obterTotalPorCategoria() {
    const rows = db.prepare(`
      SELECT categoria, tipo, SUM(valor) as total
      FROM transacoes
      GROUP BY categoria, tipo
      ORDER BY total DESC
    `).all();
    return rows.map(r => ({ ...r, total: Number(r.total) }));
  }

  obterTotalPorMes() {
    const resultados = db.prepare(`
      SELECT substr(data, 1, 7) as mes, tipo, SUM(valor) as total
      FROM transacoes
      GROUP BY mes, tipo
      ORDER BY mes DESC
    `).all();
    const meses = {};
    resultados.forEach(r => {
      if (!meses[r.mes]) meses[r.mes] = { mes: r.mes, receitas: 0, despesas: 0, saldo: 0 };
      if (r.tipo === 'receita') meses[r.mes].receitas = Number(r.total);
      if (r.tipo === 'despesa') meses[r.mes].despesas = Number(r.total);
      meses[r.mes].saldo = meses[r.mes].receitas - meses[r.mes].despesas;
    });
    return Object.values(meses);
  }
}

module.exports = new TransacaoService();