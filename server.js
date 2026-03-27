const express = require('express');
const path = require('path');
const transacoesRouter = require('./routes/transacaoRoutes');

const app = express();
app.use(express.json());
app.use('/api/transacoes', transacoesRouter);


app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));