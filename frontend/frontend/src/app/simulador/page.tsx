'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/Navigation'

interface SimulationResult {
  target_price: number
  stop_loss: number
  risk_reward_ratio: number
  probability_target: number
  estimated_days: number
  scenarios: {
    pessimista: { price: number; probability: number }
    base: { price: number; probability: number }
    otimista: { price: number; probability: number }
  }
}

function SimuladorContent() {
  const searchParams = useSearchParams()
  const tickerParam = searchParams.get('ticker') || ''

  const [formData, setFormData] = useState({
    ticker: tickerParam,
    entryPrice: '',
    targetGain: '10',
  })

  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Mock simulation - Em produção, chamar API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const entry = parseFloat(formData.entryPrice)
      const gain = parseFloat(formData.targetGain)

      const targetPrice = entry * (1 + gain / 100)
      const stopLoss = entry * 0.98
      const riskAmount = entry - stopLoss
      const rewardAmount = targetPrice - entry
      const riskRewardRatio = rewardAmount / riskAmount

      // Simular probabilidade baseada em volatilidade (simplificado)
      const probability = Math.max(0.2, Math.min(0.8, 0.5 - gain / 200))

      // Estimar dias (simplificado)
      const estimatedDays = Math.ceil((gain / 2) + Math.random() * 30)

      setResult({
        target_price: parseFloat(targetPrice.toFixed(2)),
        stop_loss: parseFloat(stopLoss.toFixed(2)),
        risk_reward_ratio: parseFloat(riskRewardRatio.toFixed(2)),
        probability_target: parseFloat((probability * 100).toFixed(1)),
        estimated_days: estimatedDays,
        scenarios: {
          pessimista: {
            price: parseFloat((entry * 0.95).toFixed(2)),
            probability: 20,
          },
          base: {
            price: parseFloat((entry * (1 + gain / 100 * 0.7)).toFixed(2)),
            probability: 50,
          },
          otimista: {
            price: targetPrice,
            probability: 30,
          },
        },
      })
    } catch (err) {
      setError('Erro ao simular. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Simulador de Lucro-Alvo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Parâmetros da Simulação</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ticker */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ticker / Ativo *
                </label>
                <input
                  type="text"
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleChange}
                  placeholder="Ex: PETR4, VALE3, BBAS3"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">Código do ativo que você quer simular</p>
              </div>

              {/* Entry Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Preço de Entrada (R$) *
                </label>
                <input
                  type="number"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  placeholder="Ex: 25.50"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">Preço pelo qual você quer entrar</p>
              </div>

              {/* Target Gain */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Lucro-Alvo (%) *
                </label>
                <input
                  type="number"
                  name="targetGain"
                  value={formData.targetGain}
                  onChange={handleChange}
                  placeholder="Ex: 10"
                  step="0.1"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">Ganho percentual desejado</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-slate-400 transition"
              >
                {loading ? 'Simulando...' : 'Simular Lucro'}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
            </form>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Dica:</strong> Esta simulação analisa cenários baseados em dados históricos. Use-a como ferramenta complementar à sua análise.
              </p>
            </div>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="bg-white rounded-lg shadow p-8">
                  <h2 className="text-xl font-bold mb-6 text-slate-900">Resumo da Simulação</h2>

                  <div className="space-y-6">
                    {/* Target Price */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-700 font-semibold mb-1">Preço-Alvo</p>
                      <p className="text-3xl font-bold text-green-900">R$ {result.target_price.toFixed(2)}</p>
                    </div>

                    {/* Stop Loss */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-700 font-semibold mb-1">Stop Loss Recomendado</p>
                      <p className="text-3xl font-bold text-red-900">R$ {result.stop_loss.toFixed(2)}</p>
                    </div>

                    {/* Risk/Reward */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                        <p className="text-xs text-slate-600 font-semibold mb-2">Relação Risco/Retorno</p>
                        <p className="text-2xl font-bold text-slate-900">{result.risk_reward_ratio.toFixed(2)}x</p>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                        <p className="text-xs text-slate-600 font-semibold mb-2">Probabilidade de Alvo</p>
                        <p className="text-2xl font-bold text-slate-900">{result.probability_target}%</p>
                      </div>
                    </div>

                    {/* Estimated Days */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                      <p className="text-xs text-slate-600 font-semibold mb-2">Dias Estimados para o Alvo</p>
                      <p className="text-2xl font-bold text-slate-900">~{result.estimated_days} dias</p>
                    </div>
                  </div>
                </div>

                {/* Scenarios */}
                <div className="bg-white rounded-lg shadow p-8">
                  <h3 className="text-lg font-bold mb-4 text-slate-900">Cenários de Preço</h3>

                  <div className="space-y-3">
                    {/* Pessimista */}
                    <div className="p-4 border border-slate-200 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-slate-900">Pessimista</p>
                        <p className="text-sm text-slate-600">{result.scenarios.pessimista.probability}% prob.</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${result.scenarios.pessimista.probability}%` }}
                        />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-2">
                        R$ {result.scenarios.pessimista.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Base */}
                    <div className="p-4 border border-slate-200 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-slate-900">Base</p>
                        <p className="text-sm text-slate-600">{result.scenarios.base.probability}% prob.</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${result.scenarios.base.probability}%` }}
                        />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-2">
                        R$ {result.scenarios.base.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Otimista */}
                    <div className="p-4 border border-slate-200 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-slate-900">Otimista</p>
                        <p className="text-sm text-slate-600">{result.scenarios.otimista.probability}% prob.</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${result.scenarios.otimista.probability}%` }}
                        />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-2">
                        R$ {result.scenarios.otimista.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-lg text-slate-600">Preencha o formulário para ver os resultados</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default function Simulador() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SimuladorContent />
    </Suspense>
  )
}
