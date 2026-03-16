import { create } from 'zustand'
import type { FreesoundTrack } from '../types'
import { searchBGM } from '../audio/freesound'

let debounceTimer: ReturnType<typeof setTimeout> | null = null

interface SearchState {
  results: FreesoundTrack[]
  loading: boolean
  error: string | null

  bpmMin: string
  bpmMax: string
  durMin: string
  durMax: string
  freeWord: string
  selectedMoods: string[]
  selectedInsts: string[]
  sortMode: 'rel' | 'bpm' | 'dur'

  setFilter: (patch: Partial<Pick<SearchState, 'bpmMin'|'bpmMax'|'durMin'|'durMax'|'freeWord'>>) => void
  toggleMood: (m: string) => void
  toggleInst: (i: string) => void
  setSortMode: (m: 'rel'|'bpm'|'dur') => void
  fetchResults: () => Promise<void>

  toggleScene: (trackId: number, sceneId: string) => void
  togglePin: (trackId: number, playlistId: string) => void
}

const ME: Record<string,string> = {
  'わくわく':'uplifting', 'ムーディー':'moody atmospheric',
  'エレガント':'elegant', 'リラックス':'relaxing',
  '高揚':'euphoric', 'クール':'cool',
  '温かみ':'warm', 'ロマンティック':'romantic',
}
const IE: Record<string,string> = {
  'ピアノ':'piano', 'ギター':'guitar acoustic',
  'ストリングス':'strings', 'ブラス':'brass',
  'ジャズ':'jazz', 'ボッサノバ':'bossa nova', 'オーケストラ':'orchestra',
}

function debouncedFetch(get: () => SearchState) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { get().fetchResults() }, 300)
}

export const useSearchStore = create<SearchState>((set, get) => ({
  results: [],
  loading: false,
  error: null,

  bpmMin: '',
  bpmMax: '',
  durMin: '',
  durMax: '',
  freeWord: '',
  selectedMoods: [],
  selectedInsts: [],
  sortMode: 'rel',

  setFilter: (patch) => {
    set(patch)
    debouncedFetch(get)
  },

  toggleMood: (m) => {
    set(s => ({
      selectedMoods: s.selectedMoods.includes(m)
        ? s.selectedMoods.filter(x => x !== m)
        : [...s.selectedMoods, m]
    }))
    debouncedFetch(get)
  },

  toggleInst: (i) => {
    set(s => ({
      selectedInsts: s.selectedInsts.includes(i)
        ? s.selectedInsts.filter(x => x !== i)
        : [...s.selectedInsts, i]
    }))
    debouncedFetch(get)
  },

  setSortMode: (m) => set({ sortMode: m }),

  fetchResults: async () => {
    const { bpmMin, bpmMax, durMin, durMax, freeWord, selectedMoods, selectedInsts } = get()

    const parts = [
      ...selectedMoods.map(m => ME[m]),
      ...selectedInsts.map(i => IE[i]),
      freeWord,
    ].filter(Boolean)

    if (!parts.length) { set({ results: [], loading: false }); return }

    set({ loading: true, error: null })
    try {
      const raw = await searchBGM(parts.join(' '))
      const filtered = raw.filter(r => {
        const bpn = r.bpm ?? 0
        const dur = r.duration
        if (bpmMin && bpn < parseFloat(bpmMin)) return false
        if (bpmMax && bpn > parseFloat(bpmMax)) return false
        if (durMin && dur < parseFloat(durMin)) return false
        if (durMax && dur > parseFloat(durMax)) return false
        return true
      })
      const prev = get().results
      const prevMap = new Map(prev.map(t => [t.id, t]))
      const merged: FreesoundTrack[] = filtered.map(r => ({
        ...r,
        scenes: prevMap.get(r.id)?.scenes ?? new Set(),
        pinned: prevMap.get(r.id)?.pinned ?? false,
        pinnedToPlaylistId: prevMap.get(r.id)?.pinnedToPlaylistId ?? null,
      }))
      set({ results: merged, loading: false })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : String(e), loading: false })
    }
  },

  toggleScene: (trackId, sceneId) => set(s => ({
    results: s.results.map(t => {
      if (t.id !== trackId) return t
      const next = new Set(t.scenes)
      next.has(sceneId) ? next.delete(sceneId) : next.add(sceneId)
      return { ...t, scenes: next }
    })
  })),

  togglePin: (trackId, playlistId) => set(s => ({
    results: s.results.map(t => {
      if (t.id !== trackId) return t
      const pinned = t.pinned && t.pinnedToPlaylistId === playlistId ? false : true
      return { ...t, pinned, pinnedToPlaylistId: pinned ? playlistId : null }
    })
  })),
}))
