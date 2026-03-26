const transacaoService = require('../services/transacaoService');

class TransacaoController {
  criar(req, res) {
    try {
      const { descricao, valor, tipo, categoria, data } = req.body;
      if (!descricao || valor === undefined || !tipo || !categoria || !data) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
      }
      const transacao = transacaoService.criar(req.body);
      return res.status(201).json(transacao);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  listarTodas(req, res) {
    try {
      const transacoes = transacaoService.listarTodas();
      return res.status(200).json(Array.isArray(transacoes) ? transacoes : []);
    } catch {
      return res.status(200).json([]);
    }
  }

  buscarPorId(req, res) {
    try {
      const transacao = transacaoService.buscarPorId(req.params.id);
      return res.status(200).json(transacao || {});
    } catch {
      return res.status(404).json({});
    }
  }

  atualizar(req, res) {
    try {
      const transacao = transacaoService.atualizar(req.params.id, req.body);
      return res.status(200).json(transacao);
    } catch (error) {
      const status = error.message === 'Transação não encontrada' ? 404 : 400;
      return res.status(status).json({ erro: error.message });
    }
  }

  deletar(req, res) {
    try {
      const resultado = transacaoService.deletar(req.params.id);
      return res.status(200).json(resultado);
    } catch {
      return res.status(404).json({});
    }
  }

  obterResumo(req, res) {
    try {
      const resumo = transacaoService.obterResumo();
      return res.status(200).json(resumo);
    } catch {
      return res.status(200).json({});
    }
  }

  obterTotalPorCategoria(req, res) {
    try {
      const totais = transacaoService.obterTotalPorCategoria();
      return res.status(200).json(totais);
    } catch {
      return res.status(200).json([]);
    }
  }

  obterTotalPorMes(req, res) {
    try {
      const totais = transacaoService.obterTotalPorMes();
      return res.status(200).json(totais);
    } catch {
      return res.status(200).json([]);
    }
  }
}

module.exports = new TransacaoController();