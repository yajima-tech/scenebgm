import { create } from 'zustand'
import type { FreesoundResult } from '../audio/freesound'

interface PlayerState {
  currentTrack: FreesoundResult | null
  audio: HTMLAudioElement | null
  isPlaying: boolean
  currentTime: number
  duration: number
  play: (track: FreesoundResult) => void
  pause: () => void
  stop: () => void
}

export const useAudioPlayer = create<PlayerState>((set, get) => ({
  currentTrack: null,
  audio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,

  play: (track) => {
    const { audio: prev } = get()
    if (prev) { prev.pause(); prev.src = '' }
    const audio = new Audio(track.previews['preview-hq-mp3'])
    audio.crossOrigin = 'anonymous'
    audio.addEventListener('timeupdate', () => set({ currentTime: audio.currentTime }))
    audio.addEventListener('loadedmetadata', () => set({ duration: audio.duration }))
    audio.addEventListener('ended', () => set({ isPlaying: false, currentTime: 0 }))
    audio.play().catch((e) => console.error('再生エラー:', e))
    set({ currentTrack: track, audio, isPlaying: true, currentTime: 0 })
  },

  pause: () => {
    const { audio, isPlaying } = get()
    if (!audio) return
    if (isPlaying) { audio.pause(); set({ isPlaying: false }) }
    else { audio.play(); set({ isPlaying: true }) }
  },

  stop: () => {
    const { audio } = get()
    if (!audio) return
    audio.pause(); audio.src = ''
    set({ isPlaying: false, currentTrack: null, audio: null, currentTime: 0 })
  },
}))
