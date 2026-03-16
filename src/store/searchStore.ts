import { create } from 'zustand'
import type { FreesoundTrack } from '../types'
import { searchBGM } from '../audio/freesound'
import { getPresetAsFreesoundTracks } from '../data/presets'

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const STORAGE_KEY = 'scenebgm-track-tags'

function saveTagsToStorage(results: FreesoundTrack[]) {
  const data: Record<string, { scenes: string[]; pinned: boolean; pinnedToPlaylistId: string | null }> = {}
  results.forEach(t => {
    if (t.scenes.size > 0 || t.pinned) {
      data[String(t.id)] = {
        scenes: Array.from(t.scenes),
        pinned: t.pinned,
        pinnedToPlaylistId: t.pinnedToPlaylistId,
      }
    }
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadTagsFromStorage(): Record<string, { scenes: string[]; pinned: boolean; pinnedToPlaylistId: string | null }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
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
  results: getPresetAsFreesoundTracks(),
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

    if (!parts.length) { set({ results: getPresetAsFreesoundTracks(), loading: false }); return }

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
        const prev = prevMap.get(r.id)
        return {
          ...r,
          scenes: saved
            ? new Set(saved.scenes)
            : prev?.scenes ?? new Set(),
          pinned: saved
            ? saved.pinned
            : prev?.pinned ?? false,
          pinnedToPlaylistId: saved
            ? saved.pinnedToPlaylistId
            : prev?.pinnedToPlaylistId ?? null,
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
}))
