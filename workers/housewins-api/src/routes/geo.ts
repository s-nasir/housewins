import type { Env } from '../index'

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD', GB: 'GBP', EU: 'EUR', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR',
  CA: 'CAD', AU: 'AUD', JP: 'JPY', CN: 'CNY', IN: 'INR', BR: 'BRL', MX: 'MXN',
  KR: 'KRW', SG: 'SGD', HK: 'HKD', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK',
  NZ: 'NZD', ZA: 'ZAR', RU: 'RUB', NG: 'NGN', AR: 'ARS', CL: 'CLP', CO: 'COP',
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'A$', JPY: '¥', CNY: '¥',
  INR: '₹', BRL: 'R$', MXN: '$', KRW: '₩', SGD: 'S$', HKD: 'HK$', CHF: 'Fr',
  SEK: 'kr', NOK: 'kr', DKK: 'kr', NZD: 'NZ$', ZAR: 'R', RUB: '₽',
}

interface GeoResponse {
  countryCode: string
  currencyCode: string
  currencySymbol: string
  exchangeRate: number
}

async function fetchExchangeRate(currencyCode: string, env: Env): Promise<number> {
  if (currencyCode === 'USD') return 1

  const cacheKey = `exchange:${currencyCode}`
  const cached = await env.EXCHANGE_RATE_CACHE.get(cacheKey)
  if (cached) return parseFloat(cached)

  const res = await fetch('https://open.er-api.com/v6/latest/USD')
  const data = await res.json() as { rates?: Record<string, number> }
  const rate = data.rates?.[currencyCode] ?? 1

  await env.EXCHANGE_RATE_CACHE.put(cacheKey, String(rate), { expirationTtl: 3600 })
  return rate
}

export async function handleGeo(request: Request, env: Env): Promise<Response> {
  const countryCode = request.headers.get('CF-IPCountry') ?? 'US'
  const currencyCode = COUNTRY_TO_CURRENCY[countryCode] ?? 'USD'
  const currencySymbol = CURRENCY_SYMBOLS[currencyCode] ?? '$'
  const exchangeRate = await fetchExchangeRate(currencyCode, env)

  const body: GeoResponse = { countryCode, currencyCode, currencySymbol, exchangeRate }
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  })
}
