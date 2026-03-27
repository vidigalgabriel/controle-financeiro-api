const express = require('express');
const path = require('path');
const transacoesRouter = require('./src/routes/transacaoRoutes');

const app = express();
app.use(express.json());
app.use('/api/transacoes', transacoesRouter);

const buildPath = path.resolve(__dirname, '../client/build');

if (!require('fs').existsSync(buildPath)) {
  buildPath = path.resolve(__dirname, './client/build');
}

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));