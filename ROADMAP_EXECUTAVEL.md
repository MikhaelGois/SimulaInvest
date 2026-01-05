# SimulaInvest – Roadmap Executável

## 📋 Visão Geral

**Plataforma Brasil-first** para investidores pessoa física (iniciantes a quant).
**Diferencial:** Simulador de Lucro-Alvo (meta de ganho → preço-alvo, stop, risco, prazo).
**Stack:** Next.js (frontend) + NestJS (backend API) + Python (microserviços quant/ML).

---

## 🎯 MVP – Escopo (Fases 0–1)

### Módulos Iniciais (Prioridade)
1. **Analisador de Ativos** (ações/ETFs/FIIs) — análise técnica + correlação
2. **Simulador de Lucro-Alvo** — meta de ganho → preço-alvo, stop, prazo estimado
3. **Renda Fixa** — Tesouro Direto + títulos públicos (ANBIMA)
4. **Carteiras** (Markowitz) — alocação por perfil + reequilíbrio
5. **Valuation** — DCF/múltiplos com 3 cenários

### Dados (MVP)
- **brapi.dev** — cotações, históricos, fundamentos
- **ANBIMA API** — taxas e PUs de títulos públicos
- **CVM (portal aberto)** — fundamentals de empresas

---

## 📊 Esquemas de Dados

### 1. Ativo (Asset)
```json
{
  "id": "string (uuid)",
  "ticker": "string (PETR4, IBOV, RICI11)",
  "nome": "string",
  "tipo": "enum (acao, fii, etf, bdr, indice)",
  "setor": "string (tecnologia, consumo, energia)",
  "moeda": "string (BRL, USD)",
  "ativo": "boolean",
  "dataAtualizacao": "datetime"
}
```

### 2. Cotação (Quote)
```json
{
  "id": "uuid",
  "assetId": "uuid",
  "data": "date",
  "abertura": "number",
  "maximo": "number",
  "minimo": "number",
  "fechamento": "number",
  "volume": "number",
  "volumeMoeda": "number"
}
```

### 3. Indicadores Técnicos (TechnicalIndicator)
```json
{
  "id": "uuid",
  "cotacaoId": "uuid",
  "rsi14": "number (0-100)",
  "macd": "number",
  "sinalMACD": "number",
  "histogramaMACD": "number",
  "bollingerSuperior": "number",
  "bollingerMedia": "number",
  "bollingerInferior": "number",
  "volatilidade30d": "number (em %)"
}
```

### 4. Simulação de Lucro-Alvo (TargetProfitSimulation)
```json
{
  "id": "uuid",
  "usuarioId": "uuid",
  "assetId": "uuid",
  "dataSimulacao": "datetime",
  "precoEntrada": "number",
  "metaGanho": "number (em %)",
  "precoAlvo": "number (calculado)",
  "stopLoss": "number (sugerido)",
  "riscoBeneficio": "number",
  "probabilidadeAtingirMeta": "number (0-100, baseado em histórico)",
  "prazoEstimado": "string (dias)",
  "drawdownMaximoHistorico": "number",
  "cenarios": [
    {
      "nome": "otimista",
      "precoAlvo": "number",
      "probabilidade": "number"
    }
  ]
}
```

### 5. Portfólio (Portfolio)
```json
{
  "id": "uuid",
  "usuarioId": "uuid",
  "nome": "string",
  "perfil": "enum (conservador, moderado, agressivo)",
  "posicoes": [
    {
      "assetId": "uuid",
      "quantidade": "number",
      "precoMedio": "number",
      "percentualCarteira": "number"
    }
  ],
  "retornoEsperado": "number (%)",
  "volatilidade": "number (%)",
  "dataReequilibrio": "date",
  "ativo": "boolean"
}
```

### 6. Valuation (Valuation)
```json
{
  "id": "uuid",
  "assetId": "uuid",
  "dataCriacao": "datetime",
  "roe": "number",
  "roic": "number",
  "margemEBITDA": "number",
  "dvidaEBITDA": "number",
  "crescimentoReceita": "number (projetado %)",
  "dcfValorJusto": "number",
  "precoCotacao": "number",
  "desconto": "number (DCF vs preço)",
  "multiplos": {
    "pe": "number",
    "peProjectado": "number",
    "peSetorial": "number",
    "pb": "number",
    "pVpa": "number"
  },
  "cenarios": [
    {
      "nome": "pessimista",
      "taxaDesconto": "number",
      "valorJusto": "number"
    },
    {
      "nome": "base",
      "taxaDesconto": "number",
      "valorJusto": "number"
    },
    {
      "nome": "otimista",
      "taxaDesconto": "number",
      "valorJusto": "number"
    }
  ]
}
```

### 7. Títulos Públicos (FixedIncome)
```json
{
  "id": "uuid",
  "codigoTesouroDireto": "string (ex: 00380551)",
  "nomeTitulo": "string",
  "tipo": "enum (prefixado, ipca, selic)",
  "dataVencimento": "date",
  "taxaCompra": "number (%)",
  "taxaVenda": "number (%)",
  "pricoBD": "number",
  "pricoPF": "number",
  "vnaAtual": "number",
  "dataAtualizacao": "datetime"
}
```

---

## 🔌 Endpoints MVP (Backend)

### Assets
- `GET /api/assets` — lista ativos com filtros (tipo, setor)
- `GET /api/assets/:ticker` — detalhe + últimas cotações + técnica
- `GET /api/assets/:ticker/quotes` — histórico de cotações (paginado)
- `GET /api/assets/:ticker/technical` — indicadores técnicos recentes

### Simulador de Lucro-Alvo
- `POST /api/simulations/target-profit` — criar simulação
  - Input: `{ assetId, precoEntrada, metaGanho }`
  - Output: `{ precoAlvo, stopLoss, risco, prazo, cenarios }`
- `GET /api/simulations/target-profit/:id` — detalhe
- `GET /api/users/:userId/simulations` — lista do usuário

### Portfólios
- `POST /api/portfolios` — criar portfólio
- `GET /api/portfolios/:id` — detalhe (retorno, volatilidade, alocação)
- `PUT /api/portfolios/:id/rebalance` — sugerir reequilíbrio
- `POST /api/portfolios/:id/stress-test` — executar teste de crise

### Valuation
- `GET /api/valuation/:assetId` — DCF + múltiplos + cenários
- `POST /api/valuation` — calcular para novo ativo

### Renda Fixa
- `GET /api/fixed-income` — lista de títulos públicos
- `GET /api/fixed-income/:codigoTD` — detalhe + histórico de taxas
- `POST /api/fixed-income/comparator` — comparar retornos entre títulos

### Descobrir (Discovery)
- `GET /api/discover` — home com resumo de mercado
- `GET /api/discover/insights` — insights por ativo (tendências + técnica)

### Usuário & Conta
- `POST /api/auth/register` — cadastro
- `POST /api/auth/login` — login (OAuth2)
- `GET /api/users/me` — perfil
- `PUT /api/users/preferences` — preferências (perfil de risco, metas)

---

## 👤 User Stories (MVP)

### EPIC 1: Analisador de Ativos

**US-1.1** — Como investidor iniciante, quero procurar uma ação (ex: PETR4) e ver a análise técnica (RSI, MACD, Bollinger), para decidir se ela está em "oportunidade de compra".
- **AC:**
  - Página "Descobrir" mostra gráfico de preço + indicadores
  - RSI: sinal de sobrevenda (<30) e sobrecompra (>70) destacados
  - MACD: divergência e cruzamento exibidos
  - Recomendação (COMPRAR/VENDER/NEUTRO) baseada em combinação de sinais
  - Fonte e timestamp dos dados visíveis

**US-1.2** — Quero ver a correlação de uma ação com IBOV e índices internacionais, para entender meu risco sistêmico.
- **AC:**
  - Card mostra correlação 30d/90d/1y com IBOV, Nasdaq, DXY
  - Interpretação simples ("alta correlação = sobe/desce junto com mercado")

---

### EPIC 2: Simulador de Lucro-Alvo (Diferencial)

**US-2.1** — Como investidor, quero definir uma meta de ganho (ex: +15%) e receber o preço-alvo automático, além de stop loss sugerido e risco calculado.
- **AC:**
  - Input: ticker + preço de entrada + meta (%)
  - Output:
    - Preço-alvo (calculado via volatilidade histórica + tendência técnica)
    - Stop loss (baseado em suporte técnico + drawdown máximo)
    - Risco/benefício ratio
    - Prazo estimado (em dias, baseado em volatilidade)
    - Probabilidade de atingir a meta (histórico dos últimos 2-3 anos)
  - 3 cenários (pessimista/base/otimista)

**US-2.2** — Quero salvar minhas simulações e receber alertas quando o preço se aproximar do alvo ou do stop.
- **AC:**
  - Simulação aparece na página "Minhas Simulações"
  - Alerta por email/notificação quando preço cruza ±10% do target ou toca stop
  - Histórico de alertas na conta

---

### EPIC 3: Renda Fixa

**US-3.1** — Como investidor conservador, quero ver as taxas de Tesouro Direto (SELIC, IPCA, Prefixado) e comparar rentabilidade vs CD/Poupança.
- **AC:**
  - Página "Renda Fixa" lista todos os títulos disponíveis
  - Filtro por tipo (prefixado/IPCA/SELIC)
  - Colunas: vencimento, taxa de compra/venda, PU, VNA, rentabilidade esperada
  - Botão "Comparador" mostra simulação de investimento (ex: R$ 10k em IPCA vs SELIC vs Prefixado)

**US-3.2** — Quero ser alertado quando a janela de taxa abrir em títulos que me interessam.
- **AC:**
  - Aba "Alertas" permite definir título + taxa mínima desejada
  - Notificação quando taxa sobe acima do limite

---

### EPIC 4: Carteiras (Markowitz)

**US-4.1** — Como investidor intermediário, quero que o sistema sugira uma alocação por meu perfil de risco (conservador/moderado/agressivo).
- **AC:**
  - Questionário rápido (horizonte, tolerância a risco, objetivo)
  - Retorna alocação sugerida:
    - Conservador: 60% renda fixa, 30% ações, 10% alternativas
    - Moderado: 40% renda fixa, 50% ações, 10% alternativas
    - Agressivo: 20% renda fixa, 70% ações, 10% alternativas
  - Cada categoria mostra ativos sugeridos (ETFs + ações blue-chips)
  - Retorno esperado + volatilidade exibidos

**US-4.2** — Quero ser alertado quando minha carteira se desviar da alocação alvo e receber sugestão de reequilíbrio.
- **AC:**
  - Alerta quando desvio > 5%
  - Sugestão: qual ativo vender/comprar para voltar ao alvo
  - Reequilíbrio pode ser automático (se autorizado)

---

### EPIC 5: Valuation

**US-5.1** — Como investidor intermediário, quero ver DCF + múltiplos para uma ação, com 3 cenários (pessimista/base/otimista).
- **AC:**
  - Página "Valuation" de um ativo mostra:
    - Tabela com fundamentos (ROE, ROIC, margem EBITDA, dívida/EBITDA, crescimento receita)
    - DCF com pressupostos claros (WACC, taxa de crescimento)
    - Múltiplos (P/E, P/VPA, P/B) vs setorial
    - 3 cenários com valor justo em cada
    - Recomendação: COMPRAR/MANTER/VENDER (baseada em desconto vs preço atual)
    - Sensibilidade: tabela mostrando impacto de mudanças no WACC/crescimento

---

## 🏗️ Arquitetura Técnica

### Frontend
- **Next.js 15** (App Router, SSR)
- **React** com TypeScript
- **Gráficos:** ECharts (OHLC, técnica) + TradingView Lightweight Charts
- **UI:** ShadCN + Tailwind
- **PWA:** offline mode básico

### Backend (Node.js)
- **NestJS** (arquitetura modular)
- **TypeORM** para banco relacional
- **Redis** para cache de cotações
- **Bull** para filas (processamento assíncrono)
- **JWT + OAuth2** para auth

### Banco de Dados
- **PostgreSQL** (timeseries de cotações, fundamentals, portfólios)
- **TimescaleDB** extension (para séries temporais otimizadas)
- **Redis** (cache de cotações, sessões)

### Microserviços (Python)
- **FastAPI** (já em andamento no seu projeto)
- **Pandas/NumPy** para cálculos financeiros
- **scikit-learn** para ML
- **Prophet/ARIMA/LSTM** para previsão (futuro)
- **NLTK/spaCy** para NLP de sentimento (futuro)

### Integrações
- **brapi.dev** — cotações, históricos, fundamentos
- **ANBIMA API** — taxas de títulos públicos
- **CVM (portal)** — dados de fundamentos (ETL diária)

### Segurança
- **LGPD:** consentimento, minimização de dados, criptografia AES-256
- **Auth:** OAuth2 (Google/GitHub), MFA opcional
- **Rate limit:** 100 req/min por usuário anônimo, 1000 req/min autenticado
- **Logs:** estruturado (JSON) e centralizado

---

## 📅 Roadmap de Sprints (MVP)

### **Fase 0 – Setup + Data Layer (Semanas 1–2)**
- [ ] Configurar PostgreSQL + Redis + Docker Compose
- [ ] Criar modelos de banco (Asset, Quote, TechnicalIndicator)
- [ ] Integrar brapi.dev (ETL de cotações)
- [ ] Integrar ANBIMA (títulos públicos)
- [ ] Criar endpoints básicos (GET /assets, GET /assets/:ticker/quotes)

### **Fase 1 – MVP Frontend + Simulador (Semanas 3–4)**
- [ ] Home (resumo mercado)
- [ ] Página "Descobrir" (busca + análise técnica)
- [ ] Simulador de Lucro-Alvo (US-2.1)
- [ ] Página "Renda Fixa" (US-3.1)
- [ ] Deploy básico (Vercel + Render/Railway)

### **Fase 2 – Carteiras + Valuation (Semanas 5–6)**
- [ ] Implementar Markowitz no Python
- [ ] Endpoints de portfólio (US-4.1)
- [ ] Calcular DCF + múltiplos (US-5.1)
- [ ] Stress tests (CAPM, cenários)

### **Fase 3 – Alertas + Polish (Semana 7)**
- [ ] Sistema de alertas (email/push)
- [ ] Painel de usuário (minhas simulações, portfólios)
- [ ] Testes e otimizações
- [ ] Documentação de API (OpenAPI)

### **Fase 4 – Avançado (Post-MVP)**
- [ ] NLP de sentimento
- [ ] ARIMA/LSTM para previsão
- [ ] Painel macro (BCB/FED/inflação)
- [ ] Backtesting de estratégias

---

## 🎨 Páginas (Sitemap MVP)

| Página | Descrição | Componentes Chave |
|--------|-----------|-------------------|
| **/** (Home) | Resumo de mercado, chamada para Simulador | Top 5 ativos, gráfico IBOV, widget "Simule seu lucro" |
| **/descobrir** | Busca + análise técnica | Filtro ticker/setor, gráfico com indicadores, recomendação |
| **/simulador** | Simulador de Lucro-Alvo | Input (ticker, preço, meta) → output (alvo, stop, prazo) |
| **/renda-fixa** | Tesouro Direto + comparador | Lista de títulos, filtro, comparador de retornos |
| **/carteiras** | Recomendação de alocação | Quiz perfil → sugestão Markowitz → reequilíbrio |
| **/valuation/:ticker** | DCF + múltiplos | Tabela fundamentos, DCF, 3 cenários, sensibilidade |
| **/conta** | Perfil + minhas simulações | Minhas simulações, alertas, preferências |
| **/educacao** | Conteúdo (blog, vídeos) | Artigos "RSI é o quê?", "Markowitz explicado" |

---

## 📈 Métricas (KPIs)

| Métrica | Target | Ferramenta |
|---------|--------|-----------|
| **Uso do Simulador** | 30% dos usuários/mês | Mixpanel/Amplitude |
| **Precisão Técnica** | RSI/MACD 60%+ corretos | Backtest diário |
| **Latência API** | <200ms p95 | Prometheus/Grafana |
| **Retenção** | 40% após 30 dias | Mixpanel |
| **NPS** | 50+ | Survey trimestral |

---

## 🔐 Compliance & Disclaimers

- ✅ Dados de fontes oficiais (brapi, ANBIMA, CVM)
- ✅ Timestamp + fonte exibidos em cada tela
- ✅ Disclaimer: "não é recomendação de compra/venda"
- ✅ LGPD: consentimento, criptografia, exclusão de dados
- ✅ Termos de uso incluem risco de investimento

---

## 📝 Próximos Passos (Imediatos)

1. **Revisar esquemas de banco** — confirmar campos e relações
2. **Validar integrações** — testar brapi.dev e ANBIMA (rate limits, estrutura)
3. **Prototipo de UI** — Simulador de Lucro-Alvo (Figma/quick sketch)
4. **Setup dev environment** — Docker, estrutura de pastas, package.json
5. **Criar repositório/board** — GitHub Projects para rastrear sprints

---

## 📚 Referências

- [brapi.dev](https://brapi.dev) — API de cotações brasileiras
- [ANBIMA Developers](https://developers.anbima.com.br) — Títulos públicos
- [CVM Dados Abertos](https://dados.cvm.gov.br) — Fundamentals
- [Nexxant 14 Prompts](https://nexxant.com.br) — Metodologias financeiras
- [B3 Developers](https://developers.b3.com.br) — Info B2B (não é acesso direto)

---

**Versão:** 1.0 | **Data:** 2026-01-05 | **Status:** Pronto para implementação

