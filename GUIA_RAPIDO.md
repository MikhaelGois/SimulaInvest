# 🚀 Guia Rápido - SimulaInvest

## Estrutura do Projeto Completa

```
analise-financeira/
├── index.html                  # Frontend vanilla (versão antiga)
├── assets/
│   └── site.css
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models/
│   │   ├── services/          # Yahoo, Investidor10, Status Invest
│   │   └── api/endpoints/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/                   # React + TypeScript Frontend (NOVO!)
│   ├── src/
│   │   ├── components/        # Header, Footer, Card, etc.
│   │   ├── pages/             # HomePage, Simulator, etc.
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
└── docker-compose.yml
```

## ⚡ Iniciar Tudo (Docker)

```bash
# Backend + PostgreSQL + Redis
docker-compose up

# Em outro terminal: Frontend React
cd frontend
npm start
```

Acesse:
- **Frontend React**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔄 Migrando do Vanilla JS para React

### O que mudou?

**Antes** (index.html + vanilla JS):
- ✅ Lista de ações populares pré-carregadas
- ✅ Favoritos com localStorage
- ✅ Busca integrada
- ✅ Integração com backend

**Agora** (React + TypeScript):
- ✅ Componentes reutilizáveis
- ✅ Tipagem estática com TypeScript
- ✅ Roteamento com React Router
- ✅ Tailwind CSS para estilos
- ✅ Design system consistente
- 🚧 Páginas em desenvolvimento (placeholders)

### Próximos Passos

1. **Migrar lógica do vanilla JS para React**:
   - [ ] Transferir sistema de favoritos
   - [ ] Transferir busca de ativos
   - [ ] Transferir lista popular
   - [ ] Transferir simulador Monte Carlo

2. **Completar páginas**:
   - [ ] SymbolDetailPage com dados reais
   - [ ] RecommendationsPage com filtros
   - [ ] SimulatorPage com formulários
   - [ ] WatchlistPage com CRUD

3. **Adicionar features**:
   - [ ] Autenticação
   - [ ] Gráficos interativos
   - [ ] Notificações
   - [ ] Modo escuro

## 📚 Recursos

- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com
- **React Icons**: https://react-icons.github.io/react-icons

## 🐛 Troubleshooting

**Erro: Cannot find module 'react'**
```bash
cd frontend
npm install
```

**Porta 3000 em uso**
```bash
# Windows
npx kill-port 3000

# Linux/Mac
lsof -ti:3000 | xargs kill
```

**Backend não responde**
```bash
# Verificar se está rodando
docker-compose ps

# Ver logs
docker-compose logs backend
```

## 💡 Dicas

- Use o site vanilla (index.html) como referência para funcionalidades
- Componentes React ficam em `frontend/src/components/`
- Páginas React ficam em `frontend/src/pages/`
- Estilos globais em `frontend/src/index.css`
- Tailwind config em `frontend/tailwind.config.js`
