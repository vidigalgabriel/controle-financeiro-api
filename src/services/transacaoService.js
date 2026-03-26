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
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO transacoes (descricao, valor, tipo, categoria, data)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(descricao, valorNumero, tipo, categoria, data, function(err) {
        if (err) return reject(err);
        db.get('SELECT * FROM transacoes WHERE id = ?', [this.lastID], (err, row) => {
          if (err) return reject(err);
          resolve(row);
        });
      });
    });
  }

  listarTodas() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM transacoes ORDER BY data DESC', [], (err, rows) => {
        if (err) return reject(err);
        resolve(Array.isArray(rows) ? rows : []);
      });
    });
  }

  buscarPorId(id) {
    return new Promise((resolve, reject) => {
      const idNumero = Number(id);
      if (isNaN(idNumero)) return reject(new Error('ID inválido'));
      db.get('SELECT * FROM transacoes WHERE id = ?', [idNumero], (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error('Transação não encontrada'));
        resolve(row);
      });
    });
  }

  atualizar(id, transacao) {
    return new Promise(async (resolve, reject) => {
      try {
        const idNumero = Number(id);
        if (isNaN(idNumero)) throw new Error('ID inválido');
        await this.buscarPorId(idNumero);
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
        stmt.run(descricao, valorNumero, tipo, categoria, data, idNumero, function(err) {
          if (err) return reject(err);
          db.get('SELECT * FROM transacoes WHERE id = ?', [idNumero], (err, row) => {
            if (err) return reject(err);
            resolve(row);
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  deletar(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const idNumero = Number(id);
        if (isNaN(idNumero)) throw new Error('ID inválido');
        await this.buscarPorId(idNumero);
        const stmt = db.prepare('DELETE FROM transacoes WHERE id = ?');
        stmt.run(idNumero, function(err) {
          if (err) return reject(err);
          resolve({ mensagem: 'Transação deletada com sucesso' });
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  obterResumo() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT tipo, SUM(valor) as total
        FROM transacoes
        GROUP BY tipo
      `, [], (err, resultados) => {
        if (err) return reject(err);
        let receitas = 0;
        let despesas = 0;
        resultados.forEach(row => {
          if (row.tipo === 'receita') receitas = Number(row.total);
          if (row.tipo === 'despesa') despesas = Number(row.total);
        });
        resolve({ receitas, despesas, saldo: receitas - despesas });
      });
    });
  }

  obterTotalPorCategoria() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT categoria, tipo, SUM(valor) as total
        FROM transacoes
        GROUP BY categoria, tipo
        ORDER BY total DESC
      `, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(r => ({ ...r, total: Number(r.total) })));
      });
    });
  }

  obterTotalPorMes() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT substr(data, 1, 7) as mes, tipo, SUM(valor) as total
        FROM transacoes
        GROUP BY mes, tipo
        ORDER BY mes DESC
      `, [], (err, resultados) => {
        if (err) return reject(err);
        const meses = {};
        resultados.forEach(row => {
          if (!meses[row.mes]) {
            meses[row.mes] = { mes: row.mes, receitas: 0, despesas: 0, saldo: 0 };
          }
          if (row.tipo === 'receita') meses[row.mes].receitas = Number(row.total);
          if (row.tipo === 'despesa') meses[row.mes].despesas = Number(row.total);
          meses[row.mes].saldo = meses[row.mes].receitas - meses[row.mes].despesas;
        });
        resolve(Object.values(meses));
      });
    });
  }
}

module.exports = new TransacaoService();