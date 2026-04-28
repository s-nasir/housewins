import { describe, it, expect } from 'vitest'
import { secureRandom, secureRandomFloat, secureShuffle, weightedRandom } from '../lib/rng'

describe('secureRandom', () => {
  it('returns an integer within [min, max] inclusive', () => {
    const result = secureRandom(5, 10)
    expect(result).toBeGreaterThanOrEqual(5)
    expect(result).toBeLessThanOrEqual(10)
    expect(Number.isInteger(result)).toBe(true)
  })

  it('returns min when min === max', () => {
    expect(secureRandom(7, 7)).toBe(7)
  })

  it('handles single value range', () => {
    const result = secureRandom(0, 0)
    expect(result).toBe(0)
  })

  it('distribution test: secureRandom(0, 37) over 100,000 trials produces every value at least once', () => {
    const counts = new Array(38).fill(0)
    const trials = 100_000

    for (let i = 0; i < trials; i++) {
      const val = secureRandom(0, 37)
      counts[val]++
    }

    const expectedMean = trials / 38
    const maxAllowed = expectedMean * 1.5

    for (let i = 0; i <= 37; i++) {
      expect(counts[i]).toBeGreaterThan(0)
      expect(counts[i]).toBeLessThanOrEqual(maxAllowed)
    }
  })
})

describe('secureRandomFloat', () => {
  it('returns a float in [0, 1)', () => {
    const result = secureRandomFloat()
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThan(1)
  })

  it('produces varied results over multiple calls', () => {
    const results = new Set<number>()
    for (let i = 0; i < 100; i++) {
      results.add(secureRandomFloat())
    }
    expect(results.size).toBeGreaterThan(90)
  })
})

describe('secureShuffle', () => {
  it('returns a new array with the same elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = secureShuffle(input)

    expect(result).not.toBe(input)
    expect(result.length).toBe(input.length)
    expect(result.sort()).toEqual(input.sort())
  })

  it('does not mutate the input array', () => {
    const input = [1, 2, 3, 4, 5]
    const original = [...input]
    secureShuffle(input)
    expect(input).toEqual(original)
  })

  it('shuffles [1..10] 1,000 times and yields all 10 values in every position at least once', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const positionSets: Set<number>[] = Array.from({ length: 10 }, () => new Set())

    for (let i = 0; i < 1000; i++) {
      const shuffled = secureShuffle(input)
      shuffled.forEach((val: number, idx: number) => {
        positionSets[idx].add(val)
      })
    }

    positionSets.forEach((set, idx) => {
      expect(set.size).toBe(10)
    })
  })

  it('handles empty array', () => {
    const result = secureShuffle([])
    expect(result).toEqual([])
  })

  it('handles single element array', () => {
    const result = secureShuffle([42])
    expect(result).toEqual([42])
  })
})

describe('weightedRandom', () => {
  it('selects one item from the weighted list', () => {
    const items = [
      { value: 'common', weight: 70 },
      { value: 'rare', weight: 25 },
      { value: 'legendary', weight: 5 },
    ]
    const result = weightedRandom(items)
    expect(['common', 'rare', 'legendary']).toContain(result)
  })

  it('respects weight distribution over many trials', () => {
    const items = [
      { value: 'A', weight: 1 },
      { value: 'B', weight: 99 },
    ]
    const counts = { A: 0, B: 0 }
    const trials = 10_000

    for (let i = 0; i < trials; i++) {
      const result = weightedRandom(items)
      counts[result as 'A' | 'B']++
    }

    expect(counts.B).toBeGreaterThan(counts.A * 50)
  })

  it('handles single item', () => {
    const items = [{ value: 'only', weight: 100 }]
    expect(weightedRandom(items)).toBe('only')
  })

  it('handles equal weights', () => {
    const items = [
      { value: 1, weight: 10 },
      { value: 2, weight: 10 },
      { value: 3, weight: 10 },
    ]
    const result = weightedRandom(items)
    expect([1, 2, 3]).toContain(result)
  })
})
