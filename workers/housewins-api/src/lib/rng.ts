export function secureRandom(min: number, max: number): number {
  const range = max - min + 1
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return min + (buffer[0] % range)
}

export function secureRandomFloat(): number {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return buffer[0] / 0xFFFFFFFF
}

export function secureShuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandom(0, i)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function weightedRandom<T>(items: { value: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  let random = (buffer[0] % totalWeight)

  for (const item of items) {
    if (random < item.weight) {
      return item.value
    }
    random -= item.weight
  }

  return items[items.length - 1].value
}
