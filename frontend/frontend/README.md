# SimulaInvest Frontend

Frontend em Next.js 15 + TypeScript para a plataforma SimulaInvest.

## 🚀 Recursos Implementados

### ✅ Páginas Criadas

1. **Home** (`/`)
   - Hero section com call-to-action
   - Visão geral do mercado (Bovespa, Dólar, Ouro, etc.)
   - 3 recursos principais destacados
   - Links rápidos para Descobrir e Simulador

2. **Descobrir** (`/descobrir`)
   - Busca de ativos (ações, ETFs, FIIs)
   - Filtros por tipo e nome
   - Detalhes de cada ativo
   - Histórico de preços últimos 30 dias
   - Estatísticas (máxima, mínima, volume médio)
   - Link direto para simular cada ativo

3. **Simulador de Lucro-Alvo** (`/simulador`)
   - Formulário para parâmetros de simulação (ticker, preço entrada, lucro-alvo)
   - Cálculo automático de:
     - Preço-alvo
     - Stop loss recomendado
     - Relação risco/retorno
     - Probabilidade de atingir o alvo
     - Dias estimados
   - 3 cenários de preço (Pessimista, Base, Otimista)
   - Interface responsiva com gráficos

### ✅ Componentes Reutilizáveis

- **Navigation**: Barra de navegação com menu responsivo
- **AssetCard**: Card para exibir ativos com preço e variação
- **PriceChart**: Tabela interativa com histórico de preços

### ✅ Configuração

- TypeScript para type-safety
- Tailwind CSS para estilização
- Variáveis de ambiente configuradas (.env.local)
- API client pronto para integração com backend FastAPI
- Responsivo para desktop, tablet e mobile

## 🛠️ Setup Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Navegar até a pasta do projeto
cd frontend

# Instalar dependências (já instaladas)
npm install

# Servidor de desenvolvimento
npm run dev

# Acesso em http://localhost:3000
```

## 📱 Estrutura de Páginas

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── descobrir/page.tsx    # Descobrir Ativos
│   ├── simulador/page.tsx    # Simulador de Lucro
│   └── layout.tsx            # Layout global
├── components/
│   ├── Navigation.tsx        # Menu principal
│   ├── AssetCard.tsx         # Card de ativo
│   └── PriceChart.tsx        # Gráfico de preços
├── lib/
│   └── api.ts                # Cliente de API
└── globals.css               # Estilos globais
```

## 🔗 Integração com Backend

O arquivo `src/lib/api.ts` contém funções prontas para chamar o backend:

```typescript
await getAssets()
await getAsset('PETR4')
await getQuoteHistory('asset_id')
await createSimulation({...})
```

## 📊 Status Atual

✅ **Completo**: Home, Descobrir, Simulador com UI/UX
⏳ **Próximo**: Integração real com API FastAPI

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
