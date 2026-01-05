# 🧪 Guia Rápido de Teste - SimulaInvest

**Teste rápido do projeto completo em 5 minutos**

---

## ✅ Pré-requisitos

- Docker & Docker Compose instalados
- Node.js 18+
- 2 terminais abertos

---

## 🚀 Passo 1: Iniciar Backend (Terminal 1)

```bash
# Navegar até a pasta backend
cd c:\Users\MBalieroDG\Desktop\dev\analise financeira\backend

# Iniciar Docker Compose
docker-compose up -d

# Aguardar inicialização (30-60 segundos)
# Verificar: docker ps

# Popular banco de dados
python seed_db.py

# Validar setup
curl http://localhost:8000/docs
```

**Resultado esperado**:
```
✓ PostgreSQL iniciado na porta 5432
✓ Redis iniciado na porta 6379
✓ FastAPI rodando em http://localhost:8000
✓ Swagger docs em http://localhost:8000/docs
✓ Seed database populado com 7 ativos + 30 dias de cotações + 3 títulos
```

---

## 🚀 Passo 2: Iniciar Frontend (Terminal 2)

```bash
# Navegar até a pasta frontend
cd c:\Users\MBalieroDG\Desktop\dev\analise financeira\frontend\frontend

# Iniciar servidor de desenvolvimento
npm run dev

# Aguardar: "✓ Ready in 2.2s"
```

**Resultado esperado**:
```
✓ Next.js 16.1.1 iniciado
✓ Local: http://localhost:3000
✓ Servidor pronto em 2-3 segundos
```

---

## 📱 Passo 3: Testar Frontend

### Home Page
1. Abra http://localhost:3000
2. Veja:
   - ✅ Hero section com botões "Começar Análise" e "Simular Lucro"
   - ✅ Cards de mercado (Bovespa, Dólar, Ouro, Futuro)
   - ✅ 3 seções de recursos
   - ✅ Footer com links

### Página Descobrir
1. Clique em "Começar Análise" ou vá para http://localhost:3000/descobrir
2. Veja:
   - ✅ Sidebar com busca e filtros
   - ✅ Lista de 4 ativos (PETR4, VALE3, BBAS3, IVVB11)
   - ✅ Clique em um ativo
   - ✅ Ver detalhes e histórico de 30 dias
   - ✅ Botão "Simular Lucro para PETR4"

### Página Simulador
1. Clique em "Simular Lucro" na home ou acesse http://localhost:3000/simulador
2. Teste:
   - Insira PETR4 (ou outro ticker)
   - Insira preço de entrada: 28.50
   - Insira lucro-alvo: 10
   - Clique "Simular Lucro"
   - ✅ Ver resultado com:
     - Preço-alvo
     - Stop loss
     - Risco/Retorno
     - Probabilidade
     - 3 cenários

---

## 🔌 Passo 4: Testar Backend

### Health Check
```bash
curl http://localhost:8000/docs
# Deve abrir Swagger com todos os endpoints
```

### Endpoint: Listar Ativos
```bash
curl http://localhost:8000/api/v1/assets
```

**Resposta esperada**:
```json
{
  "data": [
    {
      "id": 1,
      "ticker": "PETR4",
      "name": "Petróleo Brasileiro S.A.",
      "asset_type": "ACAO",
      "sector": "energia",
      "currency": "BRL",
      "active": true
    },
    ...
  ]
}
```

### Endpoint: Detalhes de Ativo
```bash
curl http://localhost:8000/api/v1/assets/PETR4
```

### Endpoint: Histórico de Cotações
```bash
curl http://localhost:8000/api/v1/assets/1/quotes?days=30
```

### Endpoint: Criar Simulação
```bash
curl -X POST http://localhost:8000/api/v1/simulations/target-profit \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": 1,
    "entry_price": 28.50,
    "target_gain": 10
  }'
```

---

## 🔄 Integração de APIs Reais (Opcional)

### Sincronizar Cotações (Brapi.dev)
```bash
curl -X POST "http://localhost:8000/api/v1/admin/sync/brapi/quotes?tickers=PETR4&tickers=VALE3"
```

### Sincronizar Títulos (ANBIMA)
```bash
curl -X POST http://localhost:8000/api/v1/admin/sync/anbima/titles
```

### Status de APIs
```bash
curl http://localhost:8000/api/v1/admin/sync/status
```

---

## ✅ Checklist de Teste

### Frontend
- [ ] Home page carrega e mostra dados
- [ ] Menu de navegação funciona
- [ ] Página Descobrir carrega com ativos mock
- [ ] Busca por ticker funciona
- [ ] Filtro por tipo funciona
- [ ] Seleção de ativo mostra detalhes
- [ ] Histórico de preços exibe corretamente
- [ ] Página Simulador carrega
- [ ] Formulário de simulação funciona
- [ ] Cálculos são exibidos
- [ ] 3 cenários aparecem com probabilidades
- [ ] Site é responsivo em mobile

### Backend
- [ ] Docker Compose iniciou
- [ ] PostgreSQL acessível
- [ ] Redis acessível
- [ ] FastAPI respondendo
- [ ] Swagger docs aberto
- [ ] Seed database populou
- [ ] GET /api/v1/assets funciona
- [ ] GET /api/v1/assets/{ticker} funciona
- [ ] GET /api/v1/assets/{id}/quotes funciona
- [ ] POST /simulations/target-profit funciona
- [ ] GET /api/v1/fixed-income funciona
- [ ] Admin endpoints acessíveis

### Integração
- [ ] Frontend se conecta com Backend
- [ ] API client da resposta corret
- [ ] Dados mock aparecem
- [ ] Simulação calcula corretamente

---

## 🐛 Troubleshooting

### Porta 3000 já em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :3000
kill -9 [PID]
```

### Porta 8000 já em uso
```bash
# Mesmos comandos acima com :8000
```

### Erro de Docker Compose
```bash
docker-compose down  # Remover containers
docker-compose up -d # Reiniciar
```

### Build lento do Next.js
```bash
rm -rf .next
npm run build
```

### Erro de dependências Python
```bash
pip install -r requirements.txt
python seed_db.py
```

---

## 📊 Dados de Teste

### Ativos Disponíveis
```
PETR4  - Petróleo Brasileiro (entrada: 28.50)
VALE3  - Vale S.A. (entrada: 62.30)
BBAS3  - Banco do Brasil (entrada: 35.80)
ITUB4  - Itaú Unibanco (entrada: 28.20)
IVVB11 - iShares S&P 500 (entrada: 120.45)
RICI11 - Rio Bravo FII (entrada: 95.30)
IBOV   - Índice Bovespa (entrada: 130000)
```

### Simulação de Teste
```
Ticker: PETR4
Entrada: 28.50
Lucro-alvo: 10%
```

**Resultado esperado**:
```
Preço-alvo: R$ 31.35 (28.50 + 10%)
Stop loss: R$ 27.93 (28.50 - 2%)
Risco/Retorno: ~1.38x
Probabilidade: ~45-55%
Dias: ~15-20 dias
```

---

## 🎯 Próximos Testes

Após verificar tudo acima:

1. **Teste de Integração Real**
   - Configure API keys do Brapi, ANBIMA, CVM
   - Execute sync endpoints
   - Verifique se dados são importados

2. **Teste de Performance**
   - Simule 100+ queries simultaneamente
   - Monitore uso de CPU/memória

3. **Teste de Responsividade**
   - Use DevTools (F12) > Toggle device toolbar
   - Teste em iPhone 12, iPad, Desktop

4. **Teste de Acessibilidade**
   - Tab na página (navegação com teclado)
   - Zoom a 200% (readability)
   - Screen reader (NVDA, JAWS)

---

## 📝 Documentação de Referência

- **Backend Setup**: `backend/SETUP.md`
- **Frontend Setup**: `frontend/frontend/README.md`
- **API Docs**: `http://localhost:8000/docs`
- **Roadmap**: `ROADMAP_EXECUTAVEL.md`
- **Status Geral**: `PROJETO_COMPLETO_STATUS.md`

---

**Pronto para testar? Boa sorte! 🎯**
