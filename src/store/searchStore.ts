import { create } from 'zustand'
import type { FreesoundTrack, Scene } from '../types'
import { searchBGM } from '../audio/freesound'

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const STORAGE_KEY = 'scenebgm-track-tags'
const TRACKS_KEY  = 'scenebgm-track-data'

function saveTagsToStorage(results: FreesoundTrack[]) {
  const tagData: Record<string, { scenes: string[]; pinned: boolean; pinnedToPlaylistId: string | null }> = {}
  const trackData: Record<string, object> = {}

  results.forEach(t => {
    if (t.scenes.size > 0 || t.pinned) {
      const id = String(t.id)
      tagData[id] = {
        scenes: Array.from(t.scenes),
        pinned: t.pinned,
        pinnedToPlaylistId: t.pinnedToPlaylistId,
      }
      trackData[id] = {
        ...t,
        scenes: Array.from(t.scenes),
      }
    }
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tagData))
  localStorage.setItem(TRACKS_KEY, JSON.stringify(trackData))
}

function loadTagsFromStorage(): Record<string, { scenes: string[]; pinned: boolean; pinnedToPlaylistId: string | null }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function loadSavedTracks(): FreesoundTrack[] {
  try {
    const raw = localStorage.getItem(TRACKS_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as Record<string, Record<string, unknown>>
    return Object.values(data).map((t) => ({
      ...(t as unknown as FreesoundTrack),
      scenes: new Set<string>((t.scenes as string[]) ?? []),
    }))
  } catch {
    return []
  }
}

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

export const useSearchStore = create<SearchState>((set, get) => ({
  results: loadSavedTracks(),
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

    if (!parts.length) { set({ results: loadSavedTracks(), loading: false }); return }

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
      const savedTags = loadTagsFromStorage()
      const merged: FreesoundTrack[] = filtered.map(r => {
        const saved = savedTags[String(r.id)]
        const p = prevMap.get(r.id)
        return {
          ...r,
          scenes: saved
            ? new Set(saved.scenes)
            : p?.scenes ?? new Set(),
          pinned: saved
            ? saved.pinned
            : p?.pinned ?? false,
          pinnedToPlaylistId: saved
            ? saved.pinnedToPlaylistId
            : p?.pinnedToPlaylistId ?? null,
        }
      })
      set({ results: merged, loading: false })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : String(e), loading: false })
    }
  },

  toggleScene: (trackId, sceneId) => {
    set(s => {
      const results = s.results.map(t => {
        if (t.id !== trackId) return t
        const next = new Set(t.scenes)
        next.has(sceneId) ? next.delete(sceneId) : next.add(sceneId)
        return { ...t, scenes: next }
      })
      saveTagsToStorage(results)
      return { results }
    })
  },

  togglePin: (trackId, playlistId) => {
    set(s => {
      const results = s.results.map(t => {
        if (t.id !== trackId) return t
        const pinned = !(t.pinned && t.pinnedToPlaylistId === playlistId)
        return { ...t, pinned, pinnedToPlaylistId: pinned ? playlistId : null }
      })
      saveTagsToStorage(results)
      return { results }
    })
  },

  initFiltersForScene: (scene) => {
    set({
      selectedMoods: scene.defaultMoods,
      selectedInsts: scene.defaultInsts,
      bpmMin: '',
      bpmMax: '',
      durMin: '',
      durMax: '',
      freeWord: '',
    })
    get().fetchResults()
  },
}))
