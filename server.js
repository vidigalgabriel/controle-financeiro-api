const express = require('express');
const cors = require('cors');
const transacaoRoutes = require('./src/routes/transacaoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', transacaoRoutes);

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Controle Financeiro Pessoal',
    versao: '1.0.0',
    endpoints: {
      transacoes: {
        criar: 'POST /api/transacoes',
        listar: 'GET /api/transacoes',
        buscar: 'GET /api/transacoes/:id',
        atualizar: 'PUT /api/transacoes/:id',
        deletar: 'DELETE /api/transacoes/:id'
      },
      relatorios: {
        resumo: 'GET /api/relatorios/resumo',
        porCategoria: 'GET /api/relatorios/categoria',
        porMes: 'GET /api/relatorios/mes'
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});