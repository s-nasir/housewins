import { describe, it, expect } from 'vitest'
import { generateServerSeed, generateCommitment, verifyCommitment } from '../lib/provablyFair'

describe('generateServerSeed', () => {
  it('returns a 32-byte hex string (64 characters)', () => {
    const seed = generateServerSeed()
    expect(seed).toMatch(/^[0-9a-f]{64}$/)
  })

  it('generates unique seeds on subsequent calls', () => {
    const seed1 = generateServerSeed()
    const seed2 = generateServerSeed()
    expect(seed1).not.toBe(seed2)
  })
})

describe('generateCommitment', () => {
  it('returns a SHA-256 hex string (64 characters)', async () => {
    const commitment = await generateCommitment('abc123', 1)
    expect(commitment).toMatch(/^[0-9a-f]{64}$/)
  })

  it('matches the example from game-engine-specs.md for known seed/nonce pair', async () => {
    const serverSeed = '0000000000000000000000000000000000000000000000000000000000000000'
    const nonce = 0
    const commitment = await generateCommitment(serverSeed, nonce)

    const expected = '6a2ea17ca8998eeb90196b94c7fbf983b995345ce3c6d755358070a980b3544e'
    expect(commitment).toBe(expected)
  })

  it('produces different commitments for different nonces', async () => {
    const seed = 'test-seed'
    const commitment1 = await generateCommitment(seed, 1)
    const commitment2 = await generateCommitment(seed, 2)
    expect(commitment1).not.toBe(commitment2)
  })

  it('produces different commitments for different seeds', async () => {
    const commitment1 = await generateCommitment('seed-a', 1)
    const commitment2 = await generateCommitment('seed-b', 1)
    expect(commitment1).not.toBe(commitment2)
  })

  it('is deterministic for same inputs', async () => {
    const seed = 'deterministic-test'
    const nonce = 42
    const commitment1 = await generateCommitment(seed, nonce)
    const commitment2 = await generateCommitment(seed, nonce)
    expect(commitment1).toBe(commitment2)
  })
})

describe('verifyCommitment', () => {
  it('returns true for valid commitment', async () => {
    const seed = 'test-seed'
    const nonce = 5
    const commitment = await generateCommitment(seed, nonce)
    const isValid = await verifyCommitment(seed, nonce, commitment)
    expect(isValid).toBe(true)
  })

  it('returns false for invalid commitment', async () => {
    const seed = 'test-seed'
    const nonce = 5
    const wrongCommitment = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const isValid = await verifyCommitment(seed, nonce, wrongCommitment)
    expect(isValid).toBe(false)
  })

  it('returns false when nonce does not match', async () => {
    const seed = 'test-seed'
    const commitment = await generateCommitment(seed, 1)
    const isValid = await verifyCommitment(seed, 2, commitment)
    expect(isValid).toBe(false)
  })

  it('returns false when seed does not match', async () => {
    const commitment = await generateCommitment('seed-a', 1)
    const isValid = await verifyCommitment('seed-b', 1, commitment)
    expect(isValid).toBe(false)
  })
})
