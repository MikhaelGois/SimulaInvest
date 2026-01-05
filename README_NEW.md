# 🚀 SimulaInvest – Plataforma Brasil-first de Análise de Investimentos

> Converter dados em decisões — ferramentas práticas para investidores pessoa física

## 🎯 Proposta de Valor

**SimulaInvest** é uma plataforma integrada que combina:

- 📊 **Análise de Ativos** — técnica (RSI/MACD/Bollinger) + fundamentalista
- 🎯 **Simulador de Lucro-Alvo** — meta de ganho → preço-alvo, stop, risco, prazo estimado
- 💼 **Gestão de Portfólio** — otimização Markowitz + reequilíbrio automático
- 💰 **Valuation** — DCF + múltiplos + 3 cenários
- 📈 **Macro & Cenários** — impacto de juros, inflação, PIB nos setores
- 🎓 **Educação** — conteúdo family-friendly (estilo Jogando pela Fé)

---

## 🏗️ Arquitetura

```
Frontend                Backend API              Database
┌─────────────┐        ┌──────────────┐        ┌──────────────┐
│  Next.js    │◄──────►│  FastAPI     │◄──────►│ PostgreSQL   │
│  TypeScript │        │  Python      │        │  + Redis     │
│  ECharts    │        │  NestJS      │        │  (cache)     │
└─────────────┘        └──────────────┘        └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  Microserviços│
                       │  Python/ML   │
                       │  (ARIMA,LSTM)│
                       └──────────────┘
```

**Stack Atual:** Python/FastAPI + PostgreSQL + Redis (backend implementado ✅)  
**Próximo:** Next.js/TypeScript (frontend)

---

## 📁 Estrutura do Projeto

```
.
├── ROADMAP_EXECUTAVEL.md          # Plano detalhado (esquemas, endpoints, US)
├── IMPLEMENTACAO_STATUS.md        # Status atual da implementação
├── quick_start.sh                 # Script de inicialização (Docker)
│
├── backend/                       # API Python/FastAPI ✅
│   ├── app/
│   │   ├── core/                  # Configurações
│   │   ├── db/                    # SQLAlchemy + PostgreSQL
│   │   ├── models/orm/            # 8 tabelas ORM
│   │   ├── schemas/               # Pydantic (validação)
│   │   ├── api/endpoints/         # 3 rotas principais
│   │   ├── services/              # Business logic
│   │   └── main.py                # FastAPI app
│   ├── requirements.txt           # Dependências Python
│   ├── Dockerfile                 # Build da imagem
│   ├── SETUP.md                   # Documentação completa
│   ├── init_db.py                 # Inicializar BD
│   ├── seed_db.py                 # Dados de teste
│   └── test_api.py                # Testes básicos
│
├── frontend/                      # Next.js/React ⏳
│   └── (próxima semana)
│
└── docker-compose.yml             # Orquestração (PostgreSQL + Redis + API)
```

---

## 🚀 Quick Start

### **Opção 1: Docker (Recomendado) – 30 segundos**

```bash
# Clone + copiar .env
cp backend/.env.example backend/.env

# Subir tudo
docker-compose up -d

# Validar
curl http://localhost:8000/health
# Docs: http://localhost:8000/docs
```

### **Opção 2: Local (Sem Docker)**

```bash
cd backend

# Venv + deps
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copiar config
cp .env.example .env

# Inicializar BD + popular dados
python init_db.py
python seed_db.py

# Rodar
uvicorn app.main:app --reload
```

---

## 📊 Endpoints Implementados (MVP)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/v1/assets` | GET | Listar ativos (ações, ETFs, FIIs) |
| `/api/v1/assets/{ticker}` | GET | Detalhe de um ativo |
| `/api/v1/assets/{id}/quotes` | GET | Histórico de cotações |
| `/api/v1/simulations/target-profit` | POST | Criar simulação de lucro-alvo |
| `/api/v1/simulations/target-profit/{id}` | GET | Detalhe da simulação |
| `/api/v1/fixed-income` | GET | Listar títulos públicos |
| `/api/v1/fixed-income/{codigo}` | GET | Detalhe de título |
| `/health` | GET | Health check |
| `/docs` | GET | Swagger UI (documentação interativa) |

---

## 🎯 Módulos MVP (Fase 0–1)

### ✅ **Implementado**
- ✅ Estrutura backend (modelos, schemas, endpoints)
- ✅ 8 tabelas no PostgreSQL (assets, quotes, simulations, valuations, etc)
- ✅ Simulador de Lucro-Alvo (lógica matemática completa)
- ✅ API de ativos + renda fixa
- ✅ Docker + dev environment

### ⏳ **Próximo (Semanas 1–2)**
- [ ] Integrar brapi.dev para cotações em tempo real
- [ ] Integrar ANBIMA para títulos públicos
- [ ] ETL de dados CVM para fundamentals
- [ ] Testes automatizados (pytest)

### 🔜 **Fase 2–3**
- [ ] Frontend Next.js (home, descobrir, simulador)
- [ ] Portfólio com Markowitz
- [ ] Valuation (DCF + múltiplos)
- [ ] Alertas por email/push
- [ ] NLP de sentimento (notícias/redes)

---

## 📚 Documentação

- **[ROADMAP_EXECUTAVEL.md](ROADMAP_EXECUTAVEL.md)** — Plano completo (visão, personas, módulos, endpoints, user stories)
- **[IMPLEMENTACAO_STATUS.md](IMPLEMENTACAO_STATUS.md)** — O que foi implementado agora
- **[backend/SETUP.md](backend/SETUP.md)** — Setup detalhado (Docker, local, troubleshooting)
- **[/docs](http://localhost:8000/docs)** — API docs (após `docker-compose up`)

---

## 💡 Diferenciais

1. **Simulador de Lucro-Alvo** — Seu diferencial competitivo
   - Input: ticker + meta de ganho
   - Output: preço-alvo, stop loss, risco/benefício, prazo estimado, probabilidade histórica, cenários

2. **Stack Brasil-first** — Dados de fontes oficiais
   - brapi.dev (cotações, fundamentos)
   - ANBIMA (títulos públicos)
   - CVM (dados abertos de empresas)
   - B3 (quando disponível para pessoa física)

3. **Educação family-friendly** — Tom coerente com Jogando pela Fé
   - Explicadores simples (RSI é quê? Markowitz explicado)
   - Sem jargão desnecessário
   - Transparência de dados + métodos

4. **Arquitetura limpa** — Fácil manutenção e expansão
   - Separação clara: models/schemas/endpoints/services
   - Testes automatizados
   - Deploy containerizado

---

## 🔐 Segurança & Compliance

- ✅ **LGPD** — consentimento, minimização, criptografia, direito ao esquecimento
- ✅ **Dados** — fontes oficiais (CVM, ANBIMA, B3, brapi)
- ✅ **Disclaimers** — material educacional, sem recomendação de compra/venda
- ✅ **Rate limits** — proteção contra abuso

---

## 🛣️ Próximos Passos

### **Esta semana:**
```bash
# 1. Testar Docker
docker-compose up -d
curl http://localhost:8000/docs

# 2. Popular BD
docker-compose exec backend python seed_db.py

# 3. Testar endpoints
curl http://localhost:8000/api/v1/assets
```

### **Semana que vem:**
- [ ] Integração brapi.dev (cotações)
- [ ] Integração ANBIMA (títulos públicos)
- [ ] Setup Next.js frontend
- [ ] Primeira página (Home)

---

## 📖 Referências

- [Roadmap Completo](ROADMAP_EXECUTAVEL.md) — esquemas, endpoints, roadmap detalhado
- [Status Implementação](IMPLEMENTACAO_STATUS.md) — o que foi feito agora
- [Setup Backend](backend/SETUP.md) — como rodar localmente
- [brapi.dev](https://brapi.dev) — API de cotações brasileiras
- [ANBIMA](https://developers.anbima.com.br) — Títulos públicos
- [CVM Dados Abertos](https://dados.cvm.gov.br) — Fundamentos de empresas

---

## 📞 Suporte

Dúvidas? Abra uma issue no GitHub ou envie um PR!

---

**Status:** 🟢 Backend MVP Pronto para Integração  
**Versão:** 1.0.0  
**Data:** 2026-01-05  
**Próxima Atualização:** Frontend + Integrações (Semana de 2026-01-13)
