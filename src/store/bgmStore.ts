import { create } from 'zustand'
import { SCENES } from '../data/scenes'
import type { PinnedTrack, TrackParam } from '../types'

const LIVESET_ID = '__bgm_live__'

interface BGMStore {
  currentSceneId: string
  trackParams: Record<string, TrackParam>
  pinnedIds: Set<string>

  setScene: (id: string) => void
  setTrackParam: (trackId: string, baseBpm: number, patch: Partial<TrackParam>) => void
  resetTrackParam: (trackId: string, baseBpm: number, field: 'bpm' | 'pitch') => void
  togglePin: (trackId: string) => void
  getPinnedTracks: () => PinnedTrack[]
  getParam: (trackId: string, baseBpm: number) => TrackParam
}

export const useBGMStore = create<BGMStore>((set, get) => ({
  currentSceneId: SCENES[0].id,
  trackParams: {},
  pinnedIds: new Set(),

  setScene: (id) => set({ currentSceneId: id }),

  getParam: (trackId, baseBpm) => {
    return get().trackParams[trackId] ?? { bpm: baseBpm, pitch: 0 }
  },

  setTrackParam: (trackId, baseBpm, patch) => set((s) => ({
    trackParams: {
      ...s.trackParams,
      [trackId]: { ...s.getParam(trackId, baseBpm), ...patch },
    },
  })),

  resetTrackParam: (trackId, baseBpm, field) => set((s) => ({
    trackParams: {
      ...s.trackParams,
      [trackId]: {
        ...s.getParam(trackId, baseBpm),
        [field]: field === 'bpm' ? baseBpm : 0,
      },
    },
  })),

  togglePin: (trackId) => set((s) => {
    const next = new Set(s.pinnedIds)
    next.has(trackId) ? next.delete(trackId) : next.add(trackId)
    return { pinnedIds: next }
  }),

  getPinnedTracks: () => {
    const { pinnedIds } = get()
    return SCENES.flatMap((scene) =>
      scene.tracks
        .filter((t) => pinnedIds.has(t.id))
        .map((t) => ({ ...t, sceneName: scene.name, sceneIcon: scene.icon }))
    )
  },
}))

export { LIVESET_ID as BGM_LIVESET_ID }
