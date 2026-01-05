'use client'

interface AssetCardProps {
  ticker: string
  name: string
  price: number
  change?: number
  sector?: string
}

export function AssetCard({ ticker, name, price, change, sector }: AssetCardProps) {
  const isPositive = (change ?? 0) >= 0
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{ticker}</h3>
          <p className="text-sm text-slate-600">{name}</p>
        </div>
        {sector && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {sector}
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">
          R$ {price.toFixed(2)}
        </p>
        {change !== undefined && (
          <p className={`text-sm font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  )
}
