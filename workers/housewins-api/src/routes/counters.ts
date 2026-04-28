import type { Env } from '../index'
import { getCounters } from '../lib/redis'

export async function handleCounters(request: Request, env: Env): Promise<Response> {
  const snapshot = await getCounters(env)
  return new Response(
    JSON.stringify({ ...snapshot, timestamp: Date.now() }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export function handleCounterStream(request: Request, env: Env): Promise<Response> {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const send = (data: object) => {
    const chunk = `event: counters\ndata: ${JSON.stringify(data)}\n\n`
    writer.write(encoder.encode(chunk))
  }

  const stream = async () => {
    const snapshot = await getCounters(env)
    send(snapshot)

    const heartbeat = setInterval(() => {
      writer.write(encoder.encode(': heartbeat\n\n'))
    }, 30_000)

    request.signal?.addEventListener('abort', () => {
      clearInterval(heartbeat)
      writer.close()
    })
  }

  stream()

  return Promise.resolve(
    new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }),
  )
}

export async function broadcastCounters(env: Env): Promise<object> {
  return getCounters(env)
}
