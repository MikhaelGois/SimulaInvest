'use client'

interface Quote {
  date: string
  close: number
  high: number
  low: number
  open: number
  volume: number
}

interface ChartProps {
  quotes: Quote[]
  ticker: string
}

export function PriceChart({ quotes, ticker }: ChartProps) {
  if (!quotes || quotes.length === 0) {
    return <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">Nenhum dado disponível</div>
  }

  const minPrice = Math.min(...quotes.map(q => q.low))
  const maxPrice = Math.max(...quotes.map(q => q.high))
  const priceRange = maxPrice - minPrice

  const getY = (price: number) => {
    const percentage = ((price - minPrice) / priceRange) * 100
    return 100 - percentage
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4 text-slate-900">Histórico de Preços - {ticker}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-2 px-2 text-slate-600">Data</th>
              <th className="text-right py-2 px-2 text-slate-600">Abertura</th>
              <th className="text-right py-2 px-2 text-slate-600">Máxima</th>
              <th className="text-right py-2 px-2 text-slate-600">Mínima</th>
              <th className="text-right py-2 px-2 text-slate-600">Fechamento</th>
              <th className="text-right py-2 px-2 text-slate-600">Volume</th>
            </tr>
          </thead>
          <tbody>
            {quotes.slice(-10).reverse().map((quote, idx) => {
              const date = new Date(quote.date)
              const change = ((quote.close - quote.open) / quote.open) * 100
              const isPositive = change >= 0

              return (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-2 text-slate-900">{date.toLocaleDateString('pt-BR')}</td>
                  <td className="text-right py-2 px-2 text-slate-900">R$ {quote.open.toFixed(2)}</td>
                  <td className="text-right py-2 px-2 text-slate-900">R$ {quote.high.toFixed(2)}</td>
                  <td className="text-right py-2 px-2 text-slate-900">R$ {quote.low.toFixed(2)}</td>
                  <td className={`text-right py-2 px-2 font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {quote.close.toFixed(2)}
                  </td>
                  <td className="text-right py-2 px-2 text-slate-600">{(quote.volume / 1000000).toFixed(1)}M</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
