'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { AssetCard } from '@/components/AssetCard'
import { PriceChart } from '@/components/PriceChart'

interface Asset {
  id: string
  ticker: string
  name: string
  asset_type: string
  sector: string
  currency: string
  active: boolean
}

interface Quote {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function Descobrir() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')

  // Mock data - Em produção, virá da API
  const mockAssets: Asset[] = [
    {
      id: '1',
      ticker: 'PETR4',
      name: 'Petróleo Brasileiro S.A.',
      asset_type: 'ACAO',
      sector: 'energia',
      currency: 'BRL',
      active: true,
    },
    {
      id: '2',
      ticker: 'VALE3',
      name: 'Vale S.A.',
      asset_type: 'ACAO',
      sector: 'mineração',
      currency: 'BRL',
      active: true,
    },
    {
      id: '3',
      ticker: 'BBAS3',
      name: 'Banco do Brasil S.A.',
      asset_type: 'ACAO',
      sector: 'financeiro',
      currency: 'BRL',
      active: true,
    },
    {
      id: '4',
      ticker: 'IVVB11',
      name: 'iShares S&P 500 Brasil',
      asset_type: 'ETF',
      sector: 'tecnologia',
      currency: 'BRL',
      active: true,
    },
  ]

  const mockQuotes: Quote[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (30 - i))
    const basePrice = 28.5
    const variation = (Math.random() - 0.5) * 2
    const close = basePrice + variation
    const open = close + (Math.random() - 0.5)
    const high = Math.max(open, close) * 1.01
    const low = Math.min(open, close) * 0.99

    return {
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
    }
  })

  useEffect(() => {
    setAssets(mockAssets)
  }, [])

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterType || asset.asset_type === filterType
    return matchesSearch && matchesFilter
  })

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setLoading(true)
    // Simular carregamento
    setTimeout(() => {
      setQuotes(mockQuotes)
      setLoading(false)
    }, 500)
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Descobrir Ativos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Busca e Filtros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4 text-slate-900">Filtros</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Ticker ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="ACAO">Ações</option>
                  <option value="ETF">ETFs</option>
                  <option value="FII">FIIs</option>
                </select>
              </div>

              {/* Results */}
              <div className="mb-4">
                <p className="text-sm text-slate-600 font-semibold mb-4">
                  {filteredAssets.length} ativo(s) encontrado(s)
                </p>
                <div className="space-y-3">
                  {filteredAssets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleSelectAsset(asset)}
                      className={`w-full text-left p-3 rounded border-2 transition ${
                        selectedAsset?.id === asset.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{asset.ticker}</p>
                      <p className="text-xs text-slate-600">{asset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedAsset ? (
              <div className="space-y-6">
                {/* Asset Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedAsset.ticker}</h2>
                      <p className="text-slate-600">{selectedAsset.name}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      {selectedAsset.asset_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Setor</p>
                      <p className="font-bold text-slate-900">{selectedAsset.sector}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Moeda</p>
                      <p className="font-bold text-slate-900">{selectedAsset.currency}</p>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                {loading ? (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="h-96 bg-gray-100 rounded animate-pulse" />
                  </div>
                ) : quotes.length > 0 ? (
                  <PriceChart quotes={quotes} ticker={selectedAsset.ticker} />
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 text-center text-slate-500">
                    Nenhum dado disponível
                  </div>
                )}

                {/* Statistics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold mb-4 text-slate-900">Estatísticas</h3>
                  {quotes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Preço Atual</p>
                        <p className="text-2xl font-bold text-slate-900">
                          R$ {quotes[quotes.length - 1]?.close.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Máxima (30d)</p>
                        <p className="text-2xl font-bold text-slate-900">
                          R$ {Math.max(...quotes.map(q => q.high)).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Mínima (30d)</p>
                        <p className="text-2xl font-bold text-slate-900">
                          R$ {Math.min(...quotes.map(q => q.low)).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Volume Médio</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {(quotes.reduce((a, b) => a + b.volume, 0) / quotes.length / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500">Carregando estatísticas...</p>
                  )}
                </div>

                {/* CTA */}
                <a
                  href={`/simulador?ticker=${selectedAsset.ticker}`}
                  className="block text-center bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
                >
                  Simular Lucro para {selectedAsset.ticker}
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-lg text-slate-600 mb-4">
                  Selecione um ativo para ver os detalhes
                </p>
                <p className="text-slate-500">Escolha um ativo na lista ao lado para visualizar análises</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
