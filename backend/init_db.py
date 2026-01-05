#!/usr/bin/env python
"""
Script para inicializar o banco de dados (criar tabelas)
Rodar: python init_db.py
"""
import logging
from app.db import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Inicializando banco de dados...")
    try:
        init_db()
        logger.info("✓ Banco de dados inicializado com sucesso!")
    except Exception as e:
        logger.error(f"✗ Erro ao inicializar banco: {e}")
        exit(1)
