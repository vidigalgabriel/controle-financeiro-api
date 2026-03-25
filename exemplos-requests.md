# Exemplos de Requisições

Este arquivo contém exemplos prontos para testar a API. Você pode usar estes JSONs em ferramentas como Postman, Insomnia ou cURL.

## 1. Criar Transações

### Receita - Salário
```json
POST http://localhost:3000/api/transacoes

{
  "descricao": "Salário Janeiro",
  "valor": 5000.00,
  "tipo": "receita",
  "categoria": "Trabalho",
  "data": "2024-01-05"
}
```

### Receita - Freelance
```json
POST http://localhost:3000/api/transacoes

{
  "descricao": "Projeto Freelance",
  "valor": 1500.00,
  "tipo": "receita",
  "categoria": "Extra",
  "data": "2024-01-15"
}
```

### Despesa - Aluguel
```json
POST http://localhost:3000/api/transacoes

{
  "descricao": "Aluguel",
  "valor": 1200.00,
  "tipo": "despesa",
  "categoria": "Moradia",
  "data": "2024-01-10"
}
```

### Despesa - Supermercado
```json
POST http://localhost:3000/api/transacoes

{
  "descricao": "Compras do mês",
  "valor": 650.50,
  "tipo": "despesa",
  "categoria": "Alimentação",
  "data": "2024-01-12"
}
```

### Despesa - Conta de Luz
```json
POST http://localhost:3000/api/transacoes

{
  "descricao": "Conta de luz",
  "valor": 150.30,
  "tipo": "despesa",
  "categoria": "Contas",
  "data": "2024-01-08"
}
```

### Despesa - Internet
```json
POST http://localhost:3000/api/transacoes

{
  "descricao": "Internet",
  "valor": 99.90,
  "tipo": "despesa",
  "categoria": "Contas",
  "data": "2024-01-08"
}
```

### Despesa - Gasolina
```json
POST http://localhost:3000/api/transacoes

{
  "descricao": "Gasolina",
  "valor": 300.00,
  "tipo": "despesa",
  "categoria": "Transporte",
  "data": "2024-01-20"
}
```

### Receita - Investimentos
```json
POST http://localhost:3000/api/transacoes

{
  "descricao": "Rendimento de investimentos",
  "valor": 250.00,
  "tipo": "receita",
  "categoria": "Investimentos",
  "data": "2024-01-25"
}
```

## 2. Listar Todas as Transações
```
GET http://localhost:3000/api/transacoes
```

## 3. Buscar Transação por ID
```
GET http://localhost:3000/api/transacoes/1
```

## 4. Atualizar Transação
```json
PUT http://localhost:3000/api/transacoes/1

{
  "descricao": "Salário Janeiro (atualizado)",
  "valor": 5200.00,
  "tipo": "receita",
  "categoria": "Trabalho",
  "data": "2024-01-05"
}
```

## 5. Deletar Transação
```
DELETE http://localhost:3000/api/transacoes/1
```

## 6. Relatório - Resumo Financeiro
```
GET http://localhost:3000/api/relatorios/resumo
```

**Resposta esperada:**
```json
{
  "receitas": 6750,
  "despesas": 2400.70,
  "saldo": 4349.30
}
```

## 7. Relatório - Total por Categoria
```
GET http://localhost:3000/api/relatorios/categoria
```

**Resposta esperada:**
```json
[
  {
    "categoria": "Trabalho",
    "tipo": "receita",
    "total": 5000
  },
  {
    "categoria": "Extra",
    "tipo": "receita",
    "total": 1500
  },
  {
    "categoria": "Investimentos",
    "tipo": "receita",
    "total": 250
  },
  {
    "categoria": "Moradia",
    "tipo": "despesa",
    "total": 1200
  },
  {
    "categoria": "Alimentação",
    "tipo": "despesa",
    "total": 650.50
  },
  {
    "categoria": "Transporte",
    "tipo": "despesa",
    "total": 300
  },
  {
    "categoria": "Contas",
    "tipo": "despesa",
    "total": 250.20
  }
]
```

## 8. Relatório - Total por Mês
```
GET http://localhost:3000/api/relatorios/mes
```

**Resposta esperada:**
```json
[
  {
    "mes": "2024-01",
    "receitas": 6750,
    "despesas": 2400.70,
    "saldo": 4349.30
  }
]
```

---

## Comandos cURL Completos

### Criar transação
```bash
curl -X POST http://localhost:3000/api/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Salário",
    "valor": 5000,
    "tipo": "receita",
    "categoria": "Trabalho",
    "data": "2024-01-05"
  }'
```

### Listar todas
```bash
curl http://localhost:3000/api/transacoes
```

### Buscar por ID
```bash
curl http://localhost:3000/api/transacoes/1
```

### Atualizar
```bash
curl -X PUT http://localhost:3000/api/transacoes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Salário atualizado",
    "valor": 5500,
    "tipo": "receita",
    "categoria": "Trabalho",
    "data": "2024-01-05"
  }'
```

### Deletar
```bash
curl -X DELETE http://localhost:3000/api/transacoes/1
```

### Resumo financeiro
```bash
curl http://localhost:3000/api/relatorios/resumo
```

### Total por categoria
```bash
curl http://localhost:3000/api/relatorios/categoria
```

### Total por mês
```bash
curl http://localhost:3000/api/relatorios/mes
```
