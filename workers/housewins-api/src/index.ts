export interface Env {
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
  EXCHANGE_RATE_API_KEY: string
  EXCHANGE_RATE_CACHE: KVNamespace
}

const ALLOWED_ORIGINS = [
  'https://housewins.gg',
  'https://housewins.pages.dev',
  'http://localhost:5173',
]

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o.replace('*', '')))
  return {
    'Access-Control-Allow-Origin': allowed ? origin! : ALLOWED_ORIGINS[2],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    const headers = { ...corsHeaders(origin), 'Content-Type': 'application/json' }

    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), { headers })
    }

    return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Route not found' } }), {
      status: 404,
      headers,
    })
  },
}
