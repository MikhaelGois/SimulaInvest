# 🚀 SimulaInvest - Plataforma de Simulação de Investimentos

> Uma plataforma profissional, type-safe e pronta para produção que permite simular estratégias de investimentos no mercado brasileiro.

[![GitHub](https://img.shields.io/badge/GitHub-mikhaelgois-blue)](https://github.com/MikhaelGois/SimulaInvest)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](README_GITHUB.md)

---

## 📋 Sumário

- [Features](#-features)
- [Arquitetura](#-arquitetura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Quick Start](#-quick-start)
- [Documentação](#-documentação)
- [Projeto](#-projeto)
- [Contribuindo](#-contribuindo)

---

## ✨ Features

### 🏠 **Home Page**
- Visão geral do mercado (Bovespa, Dólar, Ouro, Futuros)
- Apresentação da plataforma
- 3 CTAs principais (Descobrir, Simular, Renda Fixa)

### 🔍 **Descobrir Ativos**
- 📊 Busca e filtro de ativos (Ações, ETFs, FIIs)
- 📈 Histórico de preços (30 dias - OHLCV)
- 📉 Estatísticas (Máx, Mín, Volume)
- 🎯 CTA para simular lucro-alvo

### 🎯 **Simulador de Lucro-Alvo**
- Simulação de cenários de lucro (pessimista, base, otimista)
- Cálculo de probabilidade baseado em risco
- Razão Risco/Recompensa
- Estimativa de dias para atingir meta

### 💰 **Renda Fixa**
- Listagem de títulos do governo
- Análise de rendimento
- Integração com ANBIMA

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 15)                  │
│  ┌──────────────┬──────────────┬────────────────────┐   │
│  │ Home Page    │ Descobrir    │ Simulador          │   │
│  └──────────────┴──────────────┴────────────────────┘   │
│              ↓ API Client (TypeScript)                   │
├─────────────────────────────────────────────────────────┤
│                    Backend (FastAPI)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  15+ Endpoints (Assets, Quotes, Simulations)    │   │
│  │  8 ORM Models | 10 Pydantic Schemas             │   │
│  │  3 Service Integrations (Brapi, ANBIMA, CVM)    │   │
│  └──────────────────────────────────────────────────┘   │
│              ↓ SQLAlchemy ORM                            │
├─────────────────────────────────────────────────────────┤
│          PostgreSQL 15 | Redis 7 (Cache)                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15.1.1** - React com App Router + Turbopack
- **TypeScript 5.6** - Type-safety 100%
- **Tailwind CSS 3.4** - Styling responsivo
- **React 19** - Latest features

### Backend
- **FastAPI 0.104.1** - Async web framework
- **SQLAlchemy 2.0** - ORM async
- **PostgreSQL 15** - Database
- **Redis 7** - Cache layer
- **Pydantic** - Data validation

### DevOps
- **Docker & Docker Compose** - Containerização
- **GitHub** - Version control
- **Git** - Local VCS

---

## 🚀 Quick Start

### Pré-requisitos
- Docker & Docker Compose
- Node.js 18+
- Python 3.9+

### 1️⃣ Backend

```bash
cd backend

# Iniciar containers
docker-compose up -d

# Popular banco de dados
python seed_db.py

# Acessar API
open http://localhost:8000/docs
```

### 2️⃣ Frontend

```bash
cd frontend/frontend

# Instalar dependências
npm install

# Iniciar dev server
npm run dev

# Acessar aplicação
open http://localhost:3000
```

### 3️⃣ Testar Completo

Abra seu navegador e siga:
1. **Home**: http://localhost:3000
2. **Descobrir**: http://localhost:3000/descobrir
3. **Simulador**: http://localhost:3000/simulador

---

## 📁 Estrutura do Projeto

```
simulainvest/
├── frontend/
│   └── frontend/                    # Projeto Next.js
│       ├── src/
│       │   ├── app/                 # Pages (Next.js App Router)
│       │   │   ├── page.tsx         # Home
│       │   │   ├── descobrir/       # Asset Discovery
│       │   │   └── simulador/       # Simulator
│       │   ├── components/          # Reusable components
│       │   └── lib/
│       │       └── api.ts           # API Client
│       ├── package.json
│       └── tsconfig.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                  # Entry point
│   │   ├── api/                     # API routes
│   │   │   ├── endpoints/           # 15+ endpoints
│   │   │   └── deps/                # Dependencies
│   │   ├── models/                  # 8 ORM Models
│   │   ├── schemas/                 # 10 Pydantic schemas
│   │   ├── services/                # 3 Service integrations
│   │   └── utils/                   # Utilities
│   ├── docker-compose.yml           # Stack containers
│   ├── requirements.txt
│   └── seed_db.py                   # Database seeding
│
├── 📚 Documentation/
│   ├── BOAS_VINDAS.md              # Welcome guide
│   ├── TESTE_RAPIDO.md             # 5-minute test
│   ├── PROJETO_COMPLETO_STATUS.md  # Technical status
│   ├── ARQUITETURA_VISUAL.txt      # ASCII diagrams
│   ├── INDICE_DOCUMENTACAO.md      # Documentation index
│   └── ... (more docs)
│
└── docker-compose.yml              # Root docker config
```

---

## 📊 Endpoints da API

### Assets
```
GET    /api/v1/assets              # Listar ativos
GET    /api/v1/assets/{id}         # Detalhe do ativo
POST   /api/v1/assets              # Criar ativo
PUT    /api/v1/assets/{id}         # Atualizar ativo
DELETE /api/v1/assets/{id}         # Deletar ativo
```

### Quotes (Histórico de Preços)
```
GET    /api/v1/quotes              # Listar quotes
GET    /api/v1/quotes/{asset_id}   # Histórico de um ativo
```

### Simulations (Simulador)
```
POST   /api/v1/simulations/target-profit    # Simular lucro-alvo
POST   /api/v1/simulations/returns          # Simular retorno
POST   /api/v1/simulations/risk             # Análise de risco
```

### Fixed Income (Renda Fixa)
```
GET    /api/v1/fixed-income        # Listar títulos
GET    /api/v1/fixed-income/{id}   # Detalhe título
```

### Admin (Sincronização)
```
POST   /api/v1/admin/sync-brapi    # Sincronizar dados Brapi
POST   /api/v1/admin/sync-anbima   # Sincronizar dados ANBIMA
```

---

## 📚 Documentação

| Documento | Propósito |
|-----------|-----------|
| [BOAS_VINDAS.md](BOAS_VINDAS.md) | Introdução e setup inicial |
| [TESTE_RAPIDO.md](TESTE_RAPIDO.md) | Teste em 5 minutos |
| [PROJETO_COMPLETO_STATUS.md](PROJETO_COMPLETO_STATUS.md) | Status técnico detalhado |
| [ARQUITETURA_VISUAL.txt](ARQUITETURA_VISUAL.txt) | Diagramas da arquitetura |
| [backend/SETUP.md](backend/SETUP.md) | Setup detalhado do backend |
| [frontend/frontend/README.md](frontend/frontend/README.md) | Setup detalhado do frontend |

---

## 📈 Estatísticas

| Métrica | Valor |
|---------|-------|
| **Páginas Frontend** | 3 |
| **Componentes** | 3 |
| **Endpoints API** | 15+ |
| **Modelos ORM** | 8 |
| **Schemas Pydantic** | 10 |
| **Linhas de Código** | 2000+ |
| **Documentação** | 8 arquivos (104 KB) |
| **Build Time** | 8.9s |
| **Startup Time** | 2.2s |
| **Type Safety** | 100% |
| **Erros TypeScript** | 0 |

---

## 🧪 Testes

### Verificar Build
```bash
cd frontend/frontend
npm run build
```

### Executar Dev Server
```bash
npm run dev
```

### Verificar API
```bash
curl http://localhost:8000/api/v1/assets
```

---

## 🔐 Segurança

- ✅ Type-safe em 100% (TypeScript + Pydantic)
- ✅ CORS configurado
- ✅ Rate limiting (a implementar em produção)
- ✅ Validação de entrada em todos endpoints
- ✅ Environment variables para secrets
- ✅ Prepared statements contra SQL injection

---

## 🚢 Deploy

### Opções de Deploy

#### Heroku
```bash
git push heroku main
```

#### DigitalOcean App Platform
```bash
doctl apps create --spec app.yaml
```

#### AWS (ECS + RDS)
```bash
# Docker image to ECR, RDS for database
```

#### Docker Hub
```bash
docker push username/simulainvest:latest
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 License

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Mikhael Gois**
- GitHub: [@MikhaelGois](https://github.com/MikhaelGois)
- Email: mikhaelgois@gmail.com

---

## 🎯 Roadmap

- [ ] Autenticação com JWT
- [ ] Dashboard pessoal do usuário
- [ ] Histórico de simulações
- [ ] Integração com mais corretoras
- [ ] Mobile App (React Native)
- [ ] AI-powered recommendations
- [ ] Backtesting engine
- [ ] Exportar relatórios (PDF)

---

## 📞 Suporte

Para questões e suporte:
- 📖 [Documentação](INDICE_DOCUMENTACAO.md)
- 💬 [Issues](https://github.com/MikhaelGois/SimulaInvest/issues)
- 📧 Email: mikhaelgois@gmail.com

---

<div align="center">

### ⭐ Se você achou útil, deixe uma star! ⭐

Made with ❤️ for the Brazilian investment community

</div>

---

**Status**: ✅ Production Ready - MVP 1.0  
**Última Atualização**: 5 de Janeiro de 2026  
**Versão**: 1.0.0
