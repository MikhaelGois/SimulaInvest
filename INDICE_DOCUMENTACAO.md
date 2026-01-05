# 📚 Índice de Documentação - SimulaInvest

**Projeto**: SimulaInvest - Plataforma de Simulação de Investimentos  
**Status**: ✅ MVP Completo (5 de Janeiro de 2026)

---

## 📖 Documentação Principal

### 1. **RESUMO_EXECUTIVO.md** 📌
Visão executiva do projeto completo.
- **Para quem?** Stakeholders, investidores, PMs
- **O que tem?** Visão geral, arquitetura, diferencias, pitch
- **Tempo de leitura**: 5 minutos

### 2. **PROJETO_COMPLETO_STATUS.md** 📊
Status detalhado de tudo que foi implementado.
- **Para quem?** Desenvolvedores, QA, arquitetos
- **O que tem?** Checklist de features, tecnologias, próximas etapas
- **Tempo de leitura**: 10 minutos

### 3. **TESTE_RAPIDO.md** 🧪
Guia prático para testar tudo em 5 minutos.
- **Para quem?** QA, testers, novos desenvolvedores
- **O que tem?** Passo a passo para iniciar e testar
- **Tempo de leitura**: 5 minutos

---

## 📁 Documentação por Módulo

### Backend

#### **backend/SETUP.md**
Guia completo de setup do backend.
- Pré-requisitos
- Instalação
- Configuração
- Executar
- Troubleshooting
- Exemplos de API calls

#### **backend/README.md**
Documentação técnica do backend.
- Estrutura de pastas
- Modelos ORM
- Endpoints
- Serviços
- Integração com APIs externas

#### **backend/seed_db.py**
Script para popular banco de dados com dados de teste.
- 7 ativos (PETR4, VALE3, BBAS3, ITUB4, IVVB11, RICI11, IBOV)
- 30 dias de histórico OHLCV
- 3 títulos públicos (Tesouro Direto)

#### **backend/docker-compose.yml**
Configuração de containers (Postgres, Redis, FastAPI).
- PostgreSQL 15 na porta 5432
- Redis 7 na porta 6379
- FastAPI na porta 8000
- Health checks configurados

### Frontend

#### **frontend/frontend/README.md**
Documentação técnica do frontend.
- Setup local
- Estrutura de pastas
- Componentes
- Integração com backend
- Troubleshooting

#### **FRONTEND_STATUS.md**
Status da implementação do frontend.
- Páginas implementadas
- Componentes criados
- Design e UX
- Servidor rodando

---

## 🗺️ Mapa de Informações

```
PROJETO COMPLETO
│
├── 📌 RESUMO_EXECUTIVO.md (5 min)
│   └─ Visão geral, pitch, diferencias
│
├── 📊 PROJETO_COMPLETO_STATUS.md (10 min)
│   └─ Tudo que foi implementado
│
├── 🧪 TESTE_RAPIDO.md (5 min)
│   └─ Como testar em 5 minutos
│
├── 📁 BACKEND
│   ├─ backend/SETUP.md (Instalação)
│   ├─ backend/README.md (Documentação)
│   ├─ backend/seed_db.py (Dados de teste)
│   ├─ backend/docker-compose.yml (Docker)
│   ├─ backend/requirements.txt (Dependências)
│   └─ backend/app/ (Código-fonte)
│       ├─ main.py
│       ├─ db/
│       ├─ models/
│       ├─ schemas/
│       ├─ api/
│       └─ services/
│
├── 📁 FRONTEND
│   ├─ frontend/frontend/README.md (Documentação)
│   ├─ FRONTEND_STATUS.md (Status)
│   ├─ frontend/frontend/package.json (Dependências)
│   └─ frontend/frontend/src/ (Código-fonte)
│       ├─ app/
│       │   ├─ page.tsx (Home)
│       │   ├─ descobrir/page.tsx
│       │   └─ simulador/page.tsx
│       ├─ components/
│       ├─ lib/
│       └─ styles/
│
└── 📋 ROADMAP_EXECUTAVEL.md (Planejamento inicial)
```

---

## 🎯 Guias por Objetivo

### "Quero entender o projeto rapidamente"
1. Leia: **RESUMO_EXECUTIVO.md** (5 min)
2. Acesse: http://localhost:3000 (2 min)

### "Quero testar tudo"
1. Siga: **TESTE_RAPIDO.md** (5 min)
2. Acesse: Frontend (3000) + Backend (8000) (5 min)

### "Quero desenvolver o backend"
1. Leia: **backend/SETUP.md** (10 min)
2. Leia: **backend/README.md** (15 min)
3. Código: `backend/app/` (explore)

### "Quero desenvolver o frontend"
1. Leia: **frontend/frontend/README.md** (10 min)
2. Leia: **FRONTEND_STATUS.md** (5 min)
3. Código: `frontend/frontend/src/` (explore)

### "Quero conhecer toda a stack"
1. Leia: **PROJETO_COMPLETO_STATUS.md** (10 min)
2. Veja: **Mapa de Informações** acima (5 min)

### "Quero ver o roadmap"
1. Leia: **ROADMAP_EXECUTAVEL.md** (20 min)
2. Veja: Próximas etapas em **PROJETO_COMPLETO_STATUS.md**

---

## 📚 Documentação de Referência

### API Backend

**URL**: http://localhost:8000/docs (Swagger interativo)

#### Endpoints Principais
```
GET    /api/v1/assets
GET    /api/v1/assets/{ticker}
GET    /api/v1/assets/{asset_id}/quotes
POST   /api/v1/simulations/target-profit
GET    /api/v1/simulations/target-profit/{id}
GET    /api/v1/fixed-income
POST   /api/v1/admin/sync/brapi/quotes
POST   /api/v1/admin/sync/anbima/titles
POST   /api/v1/admin/sync/cvm/fundamentals
GET    /api/v1/admin/sync/status
```

### Páginas Frontend

**URL**: http://localhost:3000

```
/                 Home (visão geral)
/descobrir        Descobrir ativos
/simulador        Simulador de lucro
```

### Dados Disponíveis

**Ativos**: PETR4, VALE3, BBAS3, ITUB4, IVVB11, RICI11, IBOV  
**Período**: 30 dias de histórico  
**Títulos**: 3 opções de Tesouro Direto  

---

## 🔧 Referência Rápida de Comandos

### Backend
```bash
# Iniciar
cd backend && docker-compose up -d && python seed_db.py

# Parar
docker-compose down

# Logs
docker-compose logs -f fastapi
```

### Frontend
```bash
# Iniciar
cd frontend/frontend && npm run dev

# Build
npm run build

# Limpar cache
rm -rf .next && npm run dev
```

### Testar APIs
```bash
# Assets
curl http://localhost:8000/api/v1/assets

# Simulação
curl -X POST http://localhost:8000/api/v1/simulations/target-profit \
  -H "Content-Type: application/json" \
  -d '{"asset_id": 1, "entry_price": 28.50, "target_gain": 10}'
```

---

## 📞 Informações Úteis

### Portas
- Frontend: **3000**
- Backend: **8000**
- PostgreSQL: **5432**
- Redis: **6379**

### Arquivos de Configuração
- Frontend: `.env.local` (NEXT_PUBLIC_API_URL)
- Backend: `.env.example` → `.env`
- Docker: `backend/docker-compose.yml`

### Dependências Principais
**Backend**: FastAPI, SQLAlchemy, Pydantic, httpx  
**Frontend**: Next.js, TypeScript, Tailwind CSS  
**Infra**: Docker, PostgreSQL, Redis  

---

## ✅ Checklist de Onboarding

- [ ] Ler RESUMO_EXECUTIVO.md
- [ ] Clonar/baixar o projeto
- [ ] Seguir TESTE_RAPIDO.md
- [ ] Acessar http://localhost:3000
- [ ] Testar página Home
- [ ] Testar página Descobrir
- [ ] Testar página Simulador
- [ ] Acessar http://localhost:8000/docs
- [ ] Testar alguns endpoints
- [ ] Ler README do backend
- [ ] Ler README do frontend
- [ ] Explorar código-fonte

**Tempo total estimado**: 30-45 minutos

---

## 🚀 Próximas Etapas

### Imediato
1. Teste completo (TESTE_RAPIDO.md)
2. Identificar gaps
3. Priorizar features

### Curto Prazo
4. Integração com APIs reais
5. Autenticação de usuários
6. Dashboard pessoal

### Médio Prazo
7. Alertas e notificações
8. Análise técnica avançada
9. PWA offline

### Longo Prazo
10. Mobile app
11. API pública
12. Integração com brokers

---

## 📄 Documentos Disponíveis

```
📁 Raiz do Projeto
├── 📌 RESUMO_EXECUTIVO.md (Este índice)
├── 📊 PROJETO_COMPLETO_STATUS.md
├── 🧪 TESTE_RAPIDO.md
├── 📚 RODMAP_EXECUTAVEL.md
├── 📁 backend/
│   ├── 📖 SETUP.md
│   ├── 📖 README.md
│   ├── 🐳 docker-compose.yml
│   ├── 🔧 requirements.txt
│   └── 📂 app/ (código-fonte)
└── 📁 frontend/
    ├── 📁 frontend/
    │   ├── 📖 README.md
    │   ├── 📦 package.json
    │   └── 📂 src/ (código-fonte)
    └── 📋 FRONTEND_STATUS.md
```

---

## 💡 Dicas

### Para iniciantes
1. Comece por RESUMO_EXECUTIVO.md
2. Veja o site em http://localhost:3000
3. Leia o código do frontend (mais simples)

### Para devs experientes
1. Clone o repo
2. Siga TESTE_RAPIDO.md
3. Explore backend/app e frontend/src
4. Verifique docker-compose.yml

### Para QA/Testers
1. Siga TESTE_RAPIDO.md
2. Use checklist lá incluído
3. Reporte bugs com telas
4. Teste em mobile (DevTools)

---

## 🎓 Aprendizado

Este projeto demonstra:
- ✅ Arquitetura moderna (frontend/backend separados)
- ✅ Type-safety (TypeScript + Pydantic)
- ✅ Integração com APIs externas
- ✅ Containerização (Docker)
- ✅ Design responsivo (mobile-first)
- ✅ UX intuitiva
- ✅ Escalabilidade
- ✅ Documentação

---

## 📞 Suporte

Para dúvidas:
1. Verifique a documentação específica (links acima)
2. Consulte o README relevante (backend/ ou frontend/)
3. Explore o código-fonte
4. Teste via http://localhost:8000/docs (Swagger)

---

**Última atualização**: 5 de Janeiro de 2026  
**Status**: ✅ MVP Completo e Pronto para Testes  
**Próxima revisão**: Após testes iniciais

---

**Bem-vindo ao SimulaInvest! 🚀**
