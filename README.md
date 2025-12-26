# Simula Invest (Plano e MVP)

Aplicativo desktop + mobile focado em análise de ações e FIIs da B3, recomendações explicáveis, simulador de lucro‑alvo e integração com a B3 quando aplicável. Referências visuais e navegacionais via Investidor10 e Status Invest (deep links, sem scraping).

## Referências (visuais/navegação)
- Investidor10: catálogos/rankings de FIIs (P/VP, DY, etc.).
- Status Invest: painéis de ações/FIIs, comparadores e carteira com B3.

## Compliance
- Sem scraping/republicação de conteúdo de terceiros.
- Market data: Yahoo Finance (histórico/proventos). Fallback: fornecedor licenciado.
- Carteira real: APIs oficiais B3 (licença + consentimento do investidor).

## Simulador de lucro‑alvo
- Sem reinvestimento: t = ln(1 + L/I0) / ln(1 + g)
- Com reinvestimento: t = ln(1 + L/I0) / ln(1 + g + y)
- Monte Carlo (GBM): μ, σ, N caminhos; reporta p10/p50/p90.

## Quick Start
1. Abrir index.html diretamente no navegador; ou servir localmente:
```powershell
python -m http.server 8080
```
Acesse http://localhost:8080/

## Roadmap
- Semanas 1–2: MAUI, Azure, deep links.
- Semanas 3–4: ETL, scores, endpoints, watchlist.
- Semanas 5–6: Simulador (determinístico + MC) e UI.
- Semanas 7–8: Backtesting, alertas, ToS/risco; planejar integração B3.

## Identidade
- Ver assets/guia_simulainvest.pdf e assets/painel.png para paleta/tipografia/componentes.
