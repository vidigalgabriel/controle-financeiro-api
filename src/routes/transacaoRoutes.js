const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');

router.post('/transacoes', (req, res) => transacaoController.criar(req, res));
router.get('/transacoes', (req, res) => transacaoController.listarTodas(req, res));
router.get('/transacoes/:id', (req, res) => transacaoController.buscarPorId(req, res));
router.put('/transacoes/:id', (req, res) => transacaoController.atualizar(req, res));
router.delete('/transacoes/:id', (req, res) => transacaoController.deletar(req, res));

router.get('/relatorios/resumo', (req, res) => transacaoController.obterResumo(req, res));
router.get('/relatorios/categoria', (req, res) => transacaoController.obterTotalPorCategoria(req, res));
router.get('/relatorios/mes', (req, res) => transacaoController.obterTotalPorMes(req, res));

module.exports = router;
