# SimulaInvest Frontend - React + TypeScript

Frontend moderno do SimulaInvest construído com React, TypeScript e Tailwind CSS.

## 🚀 Iniciar o Projeto

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

```bash
cd frontend
npm install
```

### Desenvolvimento

```bash
npm start
```

O aplicativo será aberto em [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `build/`

## 📁 Estrutura

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/           # Páginas da aplicação
│   │   ├── HomePage.tsx
│   │   ├── SymbolDetailPage.tsx
│   │   ├── RecommendationsPage.tsx
│   │   ├── SimulatorPage.tsx
│   │   ├── WatchlistPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── App.tsx          # Componente principal com rotas
│   ├── index.tsx        # Entry point
│   └── index.css        # Estilos globais Tailwind
├── tailwind.config.js   # Configuração Tailwind
├── tsconfig.json        # Configuração TypeScript
└── package.json
```

## 🎨 Design System

### Cores
- **Primary**: Tons de cinza para textos e backgrounds
- **Accent**: Verde (#84CC16) - Crescimento, esperança
- **Secondary**: Dourado (#FBBF24) - Fé, valor
- **Success**: Verde (#22C55E)
- **Danger**: Vermelho (#EF4444)

### Tipografia
- **Sans**: Inter (principal)
- **Serif**: Georgia (títulos especiais)

## 🔗 Integração com Backend

O frontend se comunica com o backend FastAPI em `http://localhost:8000`

Endpoints principais:
- `GET /api/v1/symbols/quote/{ticker}` - Cotação
- `GET /api/v1/symbols/search?q={query}` - Busca
- `POST /api/v1/simulator/time-to-target` - Simulador

## 📦 Dependências Principais

- **react** ^18.2.0
- **react-router-dom** ^6.21.0
- **react-icons** ^4.12.0
- **tailwindcss** ^3.3.6
- **typescript** ^4.9.5

## 🚧 TODO

- [ ] Implementar páginas completas (atualmente placeholder)
- [ ] Integrar com backend real
- [ ] Adicionar gráficos (Recharts ou Chart.js)
- [ ] Autenticação de usuários
- [ ] Tema dark mode
- [ ] Testes unitários

## 📝 Licença

MIT
