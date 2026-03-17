import { create } from 'zustand'
import type { FreesoundTrack, Scene } from '../types'
import { searchBGM } from '../audio/freesound'
import { saveTracks, loadTracks } from '../utils/storage'

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
  initFiltersForScene: (scene: Scene) => void
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

const savedTracks = loadTracks()

export const useSearchStore = create<SearchState>((set, get) => ({
  results: savedTracks,
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

    if (!parts.length) { set({ results: loadTracks(), loading: false }); return }

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

      const saved = loadTracks()
      const savedMap = new Map(saved.map(t => [String(t.id), t]))
      const prevMap = new Map(get().results.map(t => [String(t.id), t]))

      const merged: FreesoundTrack[] = filtered.map(r => {
        const s = savedMap.get(String(r.id))
        const p = prevMap.get(String(r.id))
        return {
          ...r,
          scenes: s?.scenes ?? p?.scenes ?? new Set(),
          pinned: s?.pinned ?? p?.pinned ?? false,
          pinnedToPlaylistId: s?.pinnedToPlaylistId ?? p?.pinnedToPlaylistId ?? null,
        }
      })

      const newIds = new Set(merged.map(t => String(t.id)))
      const savedOnly = saved.filter(t => !newIds.has(String(t.id)))
      set({ results: [...merged, ...savedOnly], loading: false })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : String(e), loading: false })
    }
  },

  toggleScene: (trackId, sceneId) => set(s => {
    const results = s.results.map(t => {
      if (t.id !== trackId) return t
      const next = new Set(t.scenes)
      next.has(sceneId) ? next.delete(sceneId) : next.add(sceneId)
      return { ...t, scenes: next }
    })
    saveTracks(results)
    return { results }
  }),

  togglePin: (trackId, playlistId) => set(s => {
    const results = s.results.map(t => {
      if (t.id !== trackId) return t
      const pinned = !(t.pinned && t.pinnedToPlaylistId === playlistId)
      return { ...t, pinned, pinnedToPlaylistId: pinned ? playlistId : null }
    })
    saveTracks(results)
    return { results }
  }),

  initFiltersForScene: (scene) => {
    set({
      selectedMoods: scene.defaultMoods ?? [],
      selectedInsts: scene.defaultInsts ?? [],
      bpmMin: '', bpmMax: '', durMin: '', durMax: '', freeWord: '',
    })
    get().fetchResults()
  },
}))
