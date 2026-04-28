import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SessionState {
  sessionWon: number
  sessionLost: number
  addWon: (amount: number) => void
  addLost: (amount: number) => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionWon: 0,
      sessionLost: 0,
      addWon: (amount) => set((s) => ({ sessionWon: s.sessionWon + amount })),
      addLost: (amount) => set((s) => ({ sessionLost: s.sessionLost + amount })),
    }),
    {
      name: 'housewins-session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
