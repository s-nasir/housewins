import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockGet, mockIncrByFloat } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockIncrByFloat: vi.fn(),
}))

vi.mock('../lib/redis', () => ({
  getCounters: mockGet,
  incrWagers: vi.fn(async (_env: unknown, amount: number) => {
    await mockIncrByFloat('global:wagers', amount)
  }),
  incrWinnings: vi.fn(async (_env: unknown, amount: number) => {
    await mockIncrByFloat('global:winnings', amount)
  }),
}))

import { handleCounters, handleCounterStream } from '../routes/counters'

const makeEnv = () => ({
  UPSTASH_REDIS_REST_URL: 'https://fake.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'fake-token',
  EXCHANGE_RATE_API_KEY: '',
  EXCHANGE_RATE_CACHE: {} as KVNamespace,
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/counters', () => {
  it('returns JSON snapshot with totalWagers, totalWinnings, netHouseProfit', async () => {
    mockGet.mockResolvedValue({ totalWagers: 1000, totalWinnings: 900, netHouseProfit: 100 })

    const req = new Request('https://api.housewins.gg/api/counters')
    const res = await handleCounters(req, makeEnv())

    expect(res.status).toBe(200)
    const body = await res.json() as Record<string, unknown>
    expect(body.totalWagers).toBe(1000)
    expect(body.totalWinnings).toBe(900)
    expect(body.netHouseProfit).toBe(100)
    expect(typeof body.timestamp).toBe('number')
  })

  it('returns netHouseProfit as totalWagers - totalWinnings', async () => {
    mockGet.mockResolvedValue({ totalWagers: 5000, totalWinnings: 4000, netHouseProfit: 1000 })

    const req = new Request('https://api.housewins.gg/api/counters')
    const res = await handleCounters(req, makeEnv())
    const body = await res.json() as Record<string, unknown>

    expect(body.netHouseProfit).toBe(1000)
  })
})

describe('GET /api/counter-stream', () => {
  it('returns text/event-stream content type', async () => {
    mockGet.mockResolvedValue({ totalWagers: 0, totalWinnings: 0, netHouseProfit: 0 })

    const req = new Request('https://api.housewins.gg/api/counter-stream')
    const res = await handleCounterStream(req, makeEnv())

    expect(res.headers.get('Content-Type')).toContain('text/event-stream')
    expect(res.headers.get('Cache-Control')).toBe('no-cache')
  })

  it('emits initial counters event in SSE format', async () => {
    mockGet.mockResolvedValue({ totalWagers: 1250, totalWinnings: 1100, netHouseProfit: 150 })

    const req = new Request('https://api.housewins.gg/api/counter-stream')
    const res = await handleCounterStream(req, makeEnv())

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let text = ''

    const { value } = await reader.read()
    text += decoder.decode(value, { stream: true })
    reader.cancel()

    expect(text).toContain('event: counters')
    expect(text).toContain('"totalWagers":1250')
    expect(text).toContain('"totalWinnings":1100')
    expect(text).toContain('"netHouseProfit":150')
  })
})
