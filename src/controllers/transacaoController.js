const transacaoService = require('../services/transacaoService');

class TransacaoController {
  async criar(req, res) {
    try {
      const transacao = await transacaoService.criar(req.body);
      return res.status(201).json(transacao);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async listarTodas(req, res) {
    try {
      const transacoes = await transacaoService.listarTodas();
      return res.status(200).json(transacoes);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const transacao = await transacaoService.buscarPorId(id);
      return res.status(200).json(transacao);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const transacao = await transacaoService.atualizar(id, req.body);
      return res.status(200).json(transacao);
    } catch (error) {
      const status = error.message === 'Transação não encontrada' ? 404 : 400;
      return res.status(status).json({ erro: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await transacaoService.deletar(id);
      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async obterResumo(req, res) {
    try {
      const resumo = await transacaoService.obterResumo();
      return res.status(200).json(resumo);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async obterTotalPorCategoria(req, res) {
    try {
      const totais = await transacaoService.obterTotalPorCategoria();
      return res.status(200).json(totais);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async obterTotalPorMes(req, res) {
    try {
      const totais = await transacaoService.obterTotalPorMes();
      return res.status(200).json(totais);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new TransacaoController();