export function generateServerSeed(): string {
  const buffer = new Uint8Array(32)
  crypto.getRandomValues(buffer)
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function generateCommitment(serverSeed: string, nonce: number): Promise<string> {
  const data = new TextEncoder().encode(`${serverSeed}:${nonce}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyCommitment(serverSeed: string, nonce: number, commitment: string): Promise<boolean> {
  const computed = await generateCommitment(serverSeed, nonce)
  return computed === commitment
}
