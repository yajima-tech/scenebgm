import { create } from 'zustand'
import type { GeminiSearchResult } from '../audio/gemini'
import { promptToSearchQueries } from '../audio/gemini'
import type { FreesoundResult } from '../audio/freesound'
import { searchBGMMultiple } from '../audio/freesound'

type GenStatus = 'idle' | 'thinking' | 'searching' | 'done' | 'error'

interface AiGenStore {
  prompt: string
  genre: string
  tempo: string
  duration: string
  varCount: number

  status: GenStatus
  statusMessage: string
  error: string | null

  geminiResult: GeminiSearchResult | null
  results: FreesoundResult[]
  selectedIndex: number

  setPrompt: (v: string) => void
  setGenre: (v: string) => void
  setTempo: (v: string) => void
  setDuration: (v: string) => void
  setVarCount: (v: number) => void
  setSelectedIndex: (i: number) => void
  generate: () => Promise<void>
  reset: () => void
}

export const useAiGenStore = create<AiGenStore>((set, get) => ({
  prompt: '',
  genre: 'ジャズ',
  tempo: '普通 (80-110)',
  duration: '1分',
  varCount: 3,
  status: 'idle',
  statusMessage: '',
  error: null,
  geminiResult: null,
  results: [],
  selectedIndex: 0,

  setPrompt: (v) => set({ prompt: v }),
  setGenre: (v) => set({ genre: v }),
  setTempo: (v) => set({ tempo: v }),
  setDuration: (v) => set({ duration: v }),
  setVarCount: (v) => set({ varCount: v }),
  setSelectedIndex: (i) => set({ selectedIndex: i }),
  reset: () => set({ status: 'idle', results: [], geminiResult: null, error: null }),

  generate: async () => {
    const { prompt, genre, tempo, duration, varCount } = get()
    if (!prompt.trim()) return

    try {
      set({ status: 'thinking', statusMessage: 'AIがイメージを解析中...', error: null, results: [] })
      const geminiResult = await promptToSearchQueries(prompt, genre, tempo, duration)
      set({ geminiResult, statusMessage: 'Freesoundで楽曲を検索中...', status: 'searching' })

      const [bpmMin, bpmMax] = geminiResult.bpmRange
      const durSec = duration === '30秒' ? 60
        : duration === '1分' ? 120
        : duration === '2分' ? 240
        : 999

      const tracks = await searchBGMMultiple(
        geminiResult.queries,
        bpmMin,
        bpmMax,
        durSec
      )

      set({
        status: 'done',
        results: tracks.slice(0, Math.max(varCount, tracks.length)),
        selectedIndex: 0,
        statusMessage: '',
      })
    } catch (e: unknown) {
      set({ status: 'error', error: e instanceof Error ? e.message : String(e), statusMessage: '' })
    }
  },
}))
