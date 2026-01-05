// API client for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

// Assets
export async function getAssets(filters?: {
  ticker?: string
  type?: string
  sector?: string
}) {
  const params = new URLSearchParams()
  if (filters?.ticker) params.append('ticker', filters.ticker)
  if (filters?.type) params.append('type', filters.type)
  if (filters?.sector) params.append('sector', filters.sector)

  return apiCall(`/assets?${params.toString()}`)
}

export async function getAsset(ticker: string) {
  return apiCall(`/assets/${ticker}`)
}

export async function getQuoteHistory(assetId: string, days: number = 30) {
  return apiCall(`/assets/${assetId}/quotes?days=${days}`)
}

// Simulations
export async function createSimulation(data: {
  asset_id: string
  entry_price: number
  target_gain: number
}) {
  return apiCall('/simulations/target-profit', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getSimulation(id: string) {
  return apiCall(`/simulations/target-profit/${id}`)
}

// Fixed Income
export async function getFixedIncome(tipo?: string) {
  const params = tipo ? `?tipo=${tipo}` : ''
  return apiCall(`/fixed-income${params}`)
}

// Admin Sync (for demo purposes)
export async function syncBrapiQuotes(tickers: string[]) {
  const params = tickers.map(t => `tickers=${t}`).join('&')
  return apiCall(`/admin/sync/brapi/quotes?${params}`, { method: 'POST' })
}
