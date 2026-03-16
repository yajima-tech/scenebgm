import { create } from 'zustand'

const LIVESET_ID = '__se_live__'

interface SEStore {
  currentCatId: string
  pinnedIds: Set<string>
  view: 'pad' | 'list'

  setCat: (id: string) => void
  togglePin: (id: string) => void
  setView: (v: 'pad' | 'list') => void
}

export const useSEStore = create<SEStore>((set) => ({
  currentCatId: 'quiz',
  pinnedIds: new Set(),
  view: 'pad',

  setCat: (id) => set({ currentCatId: id }),
  setView: (v) => set({ view: v }),

  togglePin: (id) => set((s) => {
    const next = new Set(s.pinnedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    return { pinnedIds: next }
  }),
}))

export { LIVESET_ID as SE_LIVESET_ID }
