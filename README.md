# API de Controle Financeiro Pessoal

API REST completa para gerenciamento de finanças pessoais, desenvolvida com Node.js, Express e SQLite.

## Sobre o Projeto

Este projeto é uma API REST para controle financeiro pessoal que permite:
- Gerenciar transações financeiras (receitas e despesas)
- Obter relatórios de gastos por categoria
- Acompanhar receitas, despesas e saldo mensal
- Visualizar resumo financeiro geral

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web minimalista
- **SQLite** - Banco de dados relacional leve
- **better-sqlite3** - Driver para SQLite com melhor performance

## Estrutura do Projeto

```
api-controle-financeiro/
├── src/
│   ├── controllers/
│   │   └── transacaoController.js
│   ├── services/
│   │   └── transacaoService.js
│   ├── routes/
│   │   └── transacaoRoutes.js
│   └── database/
│       └── connection.js
├── server.js
├── package.json
└── README.md
```

### Camadas da Aplicação

- **routes**: Define as rotas da API
- **controllers**: Gerencia requisições e respostas HTTP
- **services**: Contém a lógica de negócio
- **database**: Configuração e conexão com o banco de dados

## Como Instalar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

### Passos de Instalação

1. Clone ou baixe este repositório

2. Entre na pasta do projeto:
```bash
cd api-controle-financeiro
```

3. Instale as dependências:
```bash
npm install
```

## Como Rodar o Projeto

Execute o comando:
```bash
npm start
```

O servidor será iniciado na porta **3000** (ou na porta definida na variável de ambiente PORT).

Você verá a mensagem:
```
Banco de dados SQLite conectado e tabela criada!
Servidor rodando na porta 3000
```

## Endpoints da API

### URL Base
```
http://localhost:3000/api
```

### 1. Criar Transação
**POST** `/transacoes`

Cria uma nova transação financeira.

**Body (JSON):**
```json
{
  "descricao": "Salário",
  "valor": 5000.00,
  "tipo": "receita",
  "categoria": "Trabalho",
  "data": "2024-01-15"
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "descricao": "Salário",
  "valor": 5000,
  "tipo": "receita",
  "categoria": "Trabalho",
  "data": "2024-01-15"
}
```

---

### 2. Listar Todas as Transações
**GET** `/transacoes`

Retorna todas as transações cadastradas, ordenadas por data (mais recentes primeiro).

**Resposta (200):**
```json
[
  {
    "id": 1,
    "descricao": "Salário",
    "valor": 5000,
    "tipo": "receita",
    "categoria": "Trabalho",
    "data": "2024-01-15"
  },
  {
    "id": 2,
    "descricao": "Conta de luz",
    "valor": 150.50,
    "tipo": "despesa",
    "categoria": "Contas",
    "data": "2024-01-10"
  }
]
```

---

### 3. Buscar Transação por ID
**GET** `/transacoes/:id`

Retorna uma transação específica.

**Exemplo:**
```
GET /transacoes/1
```

**Resposta (200):**
```json
{
  "id": 1,
  "descricao": "Salário",
  "valor": 5000,
  "tipo": "receita",
  "categoria": "Trabalho",
  "data": "2024-01-15"
}
```

**Resposta de erro (404):**
```json
{
  "erro": "Transação não encontrada"
}
```

---

### 4. Atualizar Transação
**PUT** `/transacoes/:id`

Atualiza uma transação existente.

**Body (JSON):**
```json
{
  "descricao": "Salário (13º)",
  "valor": 5500.00,
  "tipo": "receita",
  "categoria": "Trabalho",
  "data": "2024-01-15"
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "descricao": "Salário (13º)",
  "valor": 5500,
  "tipo": "receita",
  "categoria": "Trabalho",
  "data": "2024-01-15"
}
```

---

### 5. Deletar Transação
**DELETE** `/transacoes/:id`

Remove uma transação.

**Exemplo:**
```
DELETE /transacoes/1
```

**Resposta (200):**
```json
{
  "mensagem": "Transação deletada com sucesso"
}
```

---

### 6. Obter Resumo Financeiro
**GET** `/relatorios/resumo`

Retorna o total de receitas, despesas e saldo.

**Resposta (200):**
```json
{
  "receitas": 5000,
  "despesas": 1500.50,
  "saldo": 3499.50
}
```

---

### 7. Total por Categoria
**GET** `/relatorios/categoria`

Retorna o total agrupado por categoria e tipo.

**Resposta (200):**
```json
[
  {
    "categoria": "Trabalho",
    "tipo": "receita",
    "total": 5000
  },
  {
    "categoria": "Contas",
    "tipo": "despesa",
    "total": 500.50
  },
  {
    "categoria": "Alimentação",
    "tipo": "despesa",
    "total": 1000
  }
]
```

---

### 8. Total por Mês
**GET** `/relatorios/mes`

Retorna o total de receitas, despesas e saldo agrupado por mês.

**Resposta (200):**
```json
[
  {
    "mes": "2024-01",
    "receitas": 5000,
    "despesas": 1500.50,
    "saldo": 3499.50
  },
  {
    "mes": "2023-12",
    "receitas": 4500,
    "despesas": 2000,
    "saldo": 2500
  }
]
```

---

## Exemplos de Uso Completos

### Criando várias transações

**Receita:**
```bash
curl -X POST http://localhost:3000/api/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Salário Mensal",
    "valor": 5000,
    "tipo": "receita",
    "categoria": "Trabalho",
    "data": "2024-01-05"
  }'
```

**Despesa:**
```bash
curl -X POST http://localhost:3000/api/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Compra no supermercado",
    "valor": 350.80,
    "tipo": "despesa",
    "categoria": "Alimentação",
    "data": "2024-01-10"
  }'
```

### Listando transações
```bash
curl http://localhost:3000/api/transacoes
```

### Buscando transação específica
```bash
curl http://localhost:3000/api/transacoes/1
```

### Atualizando transação
```bash
curl -X PUT http://localhost:3000/api/transacoes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Salário (atualizado)",
    "valor": 5500,
    "tipo": "receita",
    "categoria": "Trabalho",
    "data": "2024-01-05"
  }'
```

### Deletando transação
```bash
curl -X DELETE http://localhost:3000/api/transacoes/1
```

### Obtendo resumo financeiro
```bash
curl http://localhost:3000/api/relatorios/resumo
```

### Obtendo total por categoria
```bash
curl http://localhost:3000/api/relatorios/categoria
```

### Obtendo total por mês
```bash
curl http://localhost:3000/api/relatorios/mes
```

---

## Validações

A API valida automaticamente:
- Todos os campos são obrigatórios
- O tipo deve ser "receita" ou "despesa"
- O valor deve ser maior que zero
- Transações inexistentes retornam erro 404

## Banco de Dados

O banco de dados SQLite é criado automaticamente ao iniciar o servidor.

**Estrutura da tabela `transacoes`:**

| Campo     | Tipo    | Descrição                           |
|-----------|---------|-------------------------------------|
| id        | INTEGER | Chave primária (auto incremento)    |
| descricao | TEXT    | Descrição da transação              |
| valor     | REAL    | Valor da transação                  |
| tipo      | TEXT    | "receita" ou "despesa"              |
| categoria | TEXT    | Categoria da transação              |
| data      | TEXT    | Data no formato YYYY-MM-DD          |

## Testando a API

Você pode testar a API usando:
- **cURL** (via terminal)
- **Postman** (interface gráfica)
- **Insomnia** (interface gráfica)
- **Thunder Client** (extensão do VS Code)

## Possíveis Melhorias Futuras

- Adicionar autenticação de usuários
- Implementar paginação na listagem
- Criar filtros por período e categoria
- Adicionar gráficos de visualização
- Implementar validação de datas
- Adicionar testes automatizados

## Autor

Projeto desenvolvido como API REST para controle financeiro pessoal.

## Licença

MIT
