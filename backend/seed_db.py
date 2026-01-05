#!/usr/bin/env python
"""
Script para popular banco de dados com dados de teste
Rodar: python seed_db.py
"""
import logging
from decimal import Decimal
from datetime import datetime, timedelta
import random

from app.db import SessionLocal, init_db
from app.models.orm import (
    AssetModel,
    QuoteModel,
    FixedIncomeModel,
    AssetType,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_database():
    """Popula o banco com dados de teste"""
    init_db()
    db = SessionLocal()
    
    try:
        # Verificar se já tem dados
        asset_count = db.query(AssetModel).count()
        if asset_count > 0:
            logger.info(f"✓ Banco já tem {asset_count} ativos. Pulando seed.")
            return
        
        logger.info("Adicionando ativos de teste...")
        
        # Ações principais
        assets_data = [
            ("PETR4", "Petróleo Brasileiro S.A.", "energia", 28.50, AssetType.ACAO),
            ("VALE3", "Vale S.A.", "mineração", 62.30, AssetType.ACAO),
            ("BBAS3", "Banco do Brasil S.A.", "financeiro", 35.80, AssetType.ACAO),
            ("ITUB4", "Itaú Unibanco Holding S.A.", "financeiro", 28.20, AssetType.ACAO),
            ("IVVB11", "iShares S&P 500 Brasil", "tecnologia", 120.45, AssetType.ETF),
            ("RICI11", "Rio Bravo Renda Imóvel FII", "imóvel", 95.30, AssetType.FII),
            ("IBOV", "Índice Bovespa", "índice", 130000, AssetType.INDICE),
        ]
        
        assets = {}
        for ticker, name, sector, base_price, asset_type in assets_data:
            asset = AssetModel(
                ticker=ticker,
                name=name,
                asset_type=asset_type,
                sector=sector if sector != "índice" else None,
                currency="BRL",
                active=True,
            )
            db.add(asset)
            db.flush()
            assets[ticker] = (asset, base_price)
        
        logger.info(f"✓ {len(assets)} ativos criados")
        
        # Adicionar cotações (últimos 30 dias)
        logger.info("Adicionando cotações de teste...")
        quote_count = 0
        
        for ticker, (asset, base_price) in assets.items():
            if asset.asset_type == AssetType.INDICE:
                continue  # Pular índices
            
            for days_ago in range(30, -1, -1):
                date = datetime.utcnow().date() - timedelta(days=days_ago)
                
                # Gerar variação realista (±3%)
                variation = random.uniform(-0.03, 0.03)
                close = Decimal(str(round(base_price * (1 + variation), 2)))
                open_p = Decimal(str(round(base_price * (1 + variation * 0.8), 2)))
                high = Decimal(str(round(max(open_p, close) * 1.01, 2)))
                low = Decimal(str(round(min(open_p, close) * 0.99, 2)))
                volume = random.randint(1000000, 10000000)
                
                quote = QuoteModel(
                    asset_id=asset.id,
                    date=datetime.combine(date, datetime.min.time()),
                    open=open_p,
                    high=high,
                    low=low,
                    close=close,
                    volume=volume,
                )
                db.add(quote)
                quote_count += 1
        
        logger.info(f"✓ {quote_count} cotações criadas")
        
        # Adicionar títulos públicos
        logger.info("Adicionando títulos públicos...")
        titles_data = [
            ("00380551", "Tesouro IPCA+ 2035", "ipca", datetime(2035, 8, 15), Decimal("5.12")),
            ("00380677", "Tesouro Prefixado 2027", "prefixado", datetime(2027, 1, 1), Decimal("10.45")),
            ("00380551", "Tesouro Selic 2026", "selic", datetime(2026, 3, 1), Decimal("10.50")),
        ]
        
        for codigo, name, tipo, maturity, taxa in titles_data:
            title = FixedIncomeModel(
                codigo_tesoureiro=codigo,
                name=name,
                tipo=tipo,
                maturity_date=maturity,
                taxa_compra=taxa,
                taxa_venda=taxa + Decimal("0.02"),
                pu_bd=Decimal("1000.00"),
                pu_pf=Decimal("1000.05"),
                vna_atual=Decimal("1000.01"),
            )
            db.add(title)
        
        logger.info(f"✓ {len(titles_data)} títulos públicos criados")
        
        db.commit()
        logger.info("\n✅ Seed concluído com sucesso!")
        print("\n" + "="*60)
        print("📊 Dados criados:")
        print("="*60)
        print(f"  • {len(assets)} ativos (ações, ETFs, FIIs, índices)")
        print(f"  • {quote_count} cotações (30 dias de histórico)")
        print(f"  • {len(titles_data)} títulos públicos (Tesouro Direto)")
        print("\n" + "="*60)
        print("🔄 Próximas etapas:")
        print("="*60)
        print("  1. Rodar: docker-compose up -d")
        print("  2. Acessar: http://localhost:8000/docs")
        print("  3. Sincronizar dados reais:")
        print("     POST /api/v1/admin/sync/brapi/quotes?tickers=PETR4&tickers=VALE3")
        print("     POST /api/v1/admin/sync/anbima/titles")
        print("     POST /api/v1/admin/sync/cvm/fundamentals?tickers=PETR4")
        print("="*60 + "\n")
        
    except Exception as e:
        logger.error(f"Erro ao fazer seed: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
