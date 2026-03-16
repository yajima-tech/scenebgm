import { create } from 'zustand'
import type { FreesoundResult } from '../audio/freesound'

interface PlayerState {
  currentTrack: FreesoundResult | null
  audio: HTMLAudioElement | null
  audioCtx: AudioContext | null
  isPlaying: boolean
  currentTime: number
  duration: number
  loop: boolean
  playbackRate: number
  detune: number

  play: (track: FreesoundResult) => void
  pause: () => void
  stop: () => void
  toggleLoop: () => void
  setPlaybackRate: (rate: number) => void
  setDetune: (cents: number) => void
  seek: (time: number) => void
}

export const useAudioPlayer = create<PlayerState>((set, get) => ({
  currentTrack: null,
  audio: null,
  audioCtx: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  loop: false,
  playbackRate: 1.0,
  detune: 0,

  play: (track) => {
    const { audio: prev, audioCtx: prevCtx } = get()
    if (prev) { prev.pause(); prev.src = '' }
    if (prevCtx) prevCtx.close().catch(() => {})

    const audio = new Audio(track.previews['preview-hq-mp3'])
    audio.crossOrigin = 'anonymous'
    audio.loop = get().loop

    const { playbackRate, detune } = get()
    const semitones = detune / 100
    audio.playbackRate = playbackRate * Math.pow(2, semitones / 12)

    const ctx = new AudioContext()
    const source = ctx.createMediaElementSource(audio)
    source.connect(ctx.destination)

    audio.play().catch(console.error)

    audio.addEventListener('timeupdate', () => set({ currentTime: audio.currentTime }))
    audio.addEventListener('loadedmetadata', () => set({ duration: audio.duration }))
    audio.addEventListener('ended', () => { if (!get().loop) set({ isPlaying: false }) })

    set({ currentTrack: track, audio, audioCtx: ctx, isPlaying: true, currentTime: 0 })
  },

  pause: () => {
    const { audio, isPlaying } = get()
    if (!audio) return
    if (isPlaying) { audio.pause(); set({ isPlaying: false }) }
    else { audio.play(); set({ isPlaying: true }) }
  },

  stop: () => {
    const { audio, audioCtx } = get()
    if (audio) { audio.pause(); audio.src = '' }
    if (audioCtx) audioCtx.close().catch(() => {})
    set({ isPlaying: false, currentTrack: null, audio: null, audioCtx: null, currentTime: 0 })
  },

  toggleLoop: () => set(s => {
    const loop = !s.loop
    if (s.audio) s.audio.loop = loop
    return { loop }
  }),

  setPlaybackRate: (rate) => {
    set({ playbackRate: rate })
    const { audio, detune } = get()
    if (audio) {
      const semitones = detune / 100
      audio.playbackRate = rate * Math.pow(2, semitones / 12)
    }
  },

  setDetune: (cents) => {
    set({ detune: cents })
    const { audio, playbackRate } = get()
    if (audio) {
      const semitones = cents / 100
      audio.playbackRate = playbackRate * Math.pow(2, semitones / 12)
    }
  },

  seek: (time) => {
    const { audio } = get()
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0))
    set({ currentTime: audio.currentTime })
  },
}))
