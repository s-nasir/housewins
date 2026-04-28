import type { Env } from '../index'

export interface CounterSnapshot {
  totalWagers: number
  totalWinnings: number
  netHouseProfit: number
}

function client(env: Env) {
  return {
    async get(key: string): Promise<string | null> {
      const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
      })
      const json = await res.json() as { result: string | null }
      return json.result
    },

    async incrByFloat(key: string, amount: number): Promise<number> {
      const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/incrbyfloat/${key}/${amount}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
      })
      const json = await res.json() as { result: string }
      return parseFloat(json.result)
    },
  }
}

export async function getCounters(env: Env): Promise<CounterSnapshot> {
  const redis = client(env)
  const [wagers, winnings] = await Promise.all([
    redis.get('global:wagers'),
    redis.get('global:winnings'),
  ])
  const totalWagers = parseFloat(wagers ?? '0')
  const totalWinnings = parseFloat(winnings ?? '0')
  return {
    totalWagers,
    totalWinnings,
    netHouseProfit: totalWagers - totalWinnings,
  }
}

export async function incrWagers(env: Env, amount: number): Promise<void> {
  await client(env).incrByFloat('global:wagers', amount)
}

export async function incrWinnings(env: Env, amount: number): Promise<void> {
  await client(env).incrByFloat('global:winnings', amount)
}
