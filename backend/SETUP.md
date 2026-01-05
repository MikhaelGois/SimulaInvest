# SimulaInvest Backend – Setup & Desenvolvimento

## 🚀 Início Rápido (Docker)

```bash
# 1. Clonar repo e entrar na pasta
git clone <repo>
cd analise-financeira

# 2. Copiar .env
cp backend/.env.example backend/.env

# 3. Subir containers (PostgreSQL + Redis + FastAPI)
docker-compose up -d

# 4. Verificar logs
docker-compose logs -f backend

# 5. API disponível em http://localhost:8000
# Docs: http://localhost:8000/docs
```

---

## 🔧 Setup Local (Sem Docker)

### Pré-requisitos
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Instalação

```bash
# 1. Criar venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Instalar dependências
cd backend
pip install -r requirements.txt

# 3. Copiar .env
cp .env.example .env

# 4. Editar .env com dados do seu DB local
DATABASE_URL=postgresql://seu_user:sua_senha@localhost:5432/simulainvest

# 5. Criar banco (apenas primeira vez)
python -m app.db.session  # Cria tabelas

# 6. Rodar servidor
uvicorn app.main:app --reload
```

---

## 📁 Estrutura de Pastas

```
backend/
├── app/
│   ├── core/              # Configurações (settings, constants)
│   │   ├── config.py      # Pydantic Settings
│   │   └── __init__.py
│   │
│   ├── db/                # Database (session, init)
│   │   ├── session.py     # SQLAlchemy setup
│   │   └── __init__.py
│   │
│   ├── models/            # ORM Models
│   │   └── orm/
│   │       ├── models.py  # Asset, Quote, Valuation, etc
│   │       └── __init__.py
│   │
│   ├── schemas/           # Pydantic Schemas (request/response)
│   │   └── __init__.py
│   │
│   ├── api/               # API Routes
│   │   ├── router.py      # Router principal (inclui todos os endpoints)
│   │   ├── deps/          # Dependências (auth, db)
│   │   │   ├── auth.py
│   │   │   └── subscription.py
│   │   └── endpoints/
│   │       ├── assets.py          # GET /assets, /assets/:ticker, etc
│   │       ├── simulations.py     # POST /simulations/target-profit
│   │       ├── fixed_income.py    # GET /fixed-income
│   │       ├── valuations.py      # GET /valuation (futuro)
│   │       ├── portfolios.py      # GET/POST /portfolios (futuro)
│   │       └── __init__.py
│   │
│   ├── services/          # Business Logic
│   │   ├── investidor10_service.py
│   │   ├── status_invest_service.py
│   │   ├── yahoo_service.py
│   │   └── __init__.py
│   │
│   ├── utils/             # Utilitários
│   │   ├── security.py    # JWT, passwords
│   │   └── __init__.py
│   │
│   ├── config.py          # Configurações gerais (antigo)
│   ├── main.py            # FastAPI app + inicialização
│   └── __init__.py
│
├── requirements.txt       # Dependências Python
├── Dockerfile            # Build da imagem
├── .env.example          # Template de variáveis de ambiente
└── README.md
```

---

## 📚 Endpoints Implementados (MVP)

### Assets
- `GET /api/v1/assets` — listar ativos com filtros
- `GET /api/v1/assets/{ticker}` — detalhe de ativo
- `GET /api/v1/assets/{asset_id}/quotes` — histórico de cotações
- `POST /api/v1/assets` — criar ativo (admin)

### Simulador de Lucro-Alvo
- `POST /api/v1/simulations/target-profit` — criar simulação
- `GET /api/v1/simulations/target-profit/{simulation_id}` — detalhe

### Renda Fixa
- `GET /api/v1/fixed-income` — listar títulos
- `GET /api/v1/fixed-income/{codigo_tesoureiro}` — detalhe
- `POST /api/v1/fixed-income` — criar título (admin)

### Health Check
- `GET /` — status geral
- `GET /health` — health check
- `GET /docs` — Swagger UI (docs interativa)

---

## 🗄️ Banco de Dados

### Tabelas Criadas Automaticamente

```
assets                          # Ativos (ações, ETFs, FIIs)
quotes                          # Cotações diárias
technical_indicators            # RSI, MACD, Bollinger, volatilidade
target_profit_simulations       # Simulações de lucro-alvo
valuations                      # DCF, múltiplos, cenários
users                           # Usuários
portfolios                      # Portfólios de usuários
fixed_income                    # Títulos públicos/privados
```

### Conexão

```python
# Verificar conexão
python -c "from app.db import SessionLocal; db = SessionLocal(); print('✓ Conectado')"
```

---

## 🧪 Testando Endpoints

### Via cURL

```bash
# Listar ativos
curl http://localhost:8000/api/v1/assets

# Buscar ação específica
curl http://localhost:8000/api/v1/assets/PETR4

# Criar simulação
curl -X POST http://localhost:8000/api/v1/simulations/target-profit \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": "uuid-do-ativo",
    "entry_price": 25.50,
    "target_gain": 15
  }'

# Listar títulos de renda fixa
curl http://localhost:8000/api/v1/fixed-income
```

### Via Swagger UI
Abrir http://localhost:8000/docs no navegador — interface interativa!

---

## 🔐 Variáveis de Ambiente (.env)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `REDIS_URL` | URL do Redis | `redis://localhost:6379` |
| `SECRET_KEY` | Chave JWT | `dev-secret-key` |
| `DEBUG` | Modo debug | `true` / `false` |
| `BRAPI_KEY` | Token da API brapi.dev | `abc123...` |
| `ANBIMA_KEY` | Token da API ANBIMA | `xyz789...` |

---

## 🛠️ Desenvolvimento

### Rodar com hot-reload

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Banco + Cache (se não usar Docker)
redis-server
psql -U simulainvest -d simulainvest
```

### Adicionar novo endpoint

1. Criar função em `app/api/endpoints/novo_modulo.py`
2. Criar schemas em `app/schemas/__init__.py`
3. Importar router em `app/api/router.py`
4. Incluir com `api_router.include_router(...)`

### Formato de resposta (padrão)

```json
{
  "status": "success",
  "data": {...},
  "error": null
}
```

---

## 📋 Próximos Passos

- [ ] **ETL de dados** — integrar brapi.dev e ANBIMA para popular banco
- [ ] **Autenticação** — OAuth2 + JWT
- [ ] **Endpoints de Portfólio** — alocação Markowitz
- [ ] **Valuation** — DCF + múltiplos
- [ ] **Alertas** — email/push quando preço toca target
- [ ] **Testes** — pytest para endpoints

---

## 🐛 Troubleshooting

### "Connection refused" ao PostgreSQL
```bash
# Verificar se container está rodando
docker ps | grep postgres

# Se não, iniciar
docker-compose up -d postgres
```

### "Module not found: app.xxx"
```bash
# Verificar PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:/path/to/backend"

# Ou rodar a partir da pasta backend
cd backend && uvicorn app.main:app --reload
```

### Limpar banco para recomeçar
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d     # Recriar do zero
```

---

## 📞 Suporte

Dúvidas? Abra uma issue no GitHub ou envie um PR!

---

**Última atualização:** 2026-01-05 | v1.0.0 MVP
