#!/bin/bash
# 🚀 SimulaInvest – Quick Start Script
# Uso: bash quick_start.sh

set -e

echo "🚀 SimulaInvest – Quick Start"
echo "======================================"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não encontrado. Instale em https://docker.com${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker encontrado${NC}"

# Copiar .env
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}→ Copiando backend/.env...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ .env criado${NC}"
else
    echo -e "${GREEN}✓ .env já existe${NC}"
fi

# Build & Up
echo -e "${YELLOW}→ Iniciando containers (pode levar ~30s)...${NC}"
docker-compose up -d

# Aguardar BD estar pronto
echo -e "${YELLOW}→ Aguardando PostgreSQL...${NC}"
sleep 10

# Testar conexão
echo -e "${YELLOW}→ Testando APIs...${NC}"

# Health check
HEALTH=$(curl -s http://localhost:8000/health)
if [[ $HEALTH == *"ok"* ]]; then
    echo -e "${GREEN}✓ Backend está rodando!${NC}"
else
    echo -e "${RED}✗ Backend não respondeu${NC}"
    echo -e "${YELLOW}→ Verifique logs: docker-compose logs backend${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}======================================"
echo "✓ SimulaInvest iniciado com sucesso!"
echo "======================================${NC}"
echo ""
echo "📚 Próximos passos:"
echo ""
echo "1. Abrir documentação (Swagger):"
echo -e "   ${YELLOW}open http://localhost:8000/docs${NC}"
echo ""
echo "2. Testar endpoint de ativos:"
echo -e "   ${YELLOW}curl http://localhost:8000/api/v1/assets${NC}"
echo ""
echo "3. Ver logs em tempo real:"
echo -e "   ${YELLOW}docker-compose logs -f backend${NC}"
echo ""
echo "4. Parar containers:"
echo -e "   ${YELLOW}docker-compose down${NC}"
echo ""
echo "📖 Documentação:"
echo "   - Setup completo: backend/SETUP.md"
echo "   - Status implementação: IMPLEMENTACAO_STATUS.md"
echo "   - Roadmap: ROADMAP_EXECUTAVEL.md"
echo ""
