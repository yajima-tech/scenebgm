import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FreesoundResult } from '../audio/freesound'

export interface PlaylistTrack extends FreesoundResult {
  sceneName: string
  sceneIcon: string
}

interface PlaylistStore {
  playlists: { id: string; name: string; tracks: PlaylistTrack[] }[]
  activePlaylistId: string

  setActivePlaylist: (id: string) => void
  createPlaylist: (name?: string) => void
  deletePlaylist: (id: string) => void
  renamePlaylist: (id: string, name: string) => void
  addTrack: (playlistId: string, track: FreesoundResult, sceneName: string, sceneIcon: string) => void
  removeTrack: (playlistId: string, trackId: string) => void
  hasTrack: (playlistId: string, trackId: string) => boolean
}

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: [
        { id: 'default', name: 'プレイリスト 1', tracks: [] }
      ],
      activePlaylistId: 'default',

      setActivePlaylist: (id) => set({ activePlaylistId: id }),

      createPlaylist: (name) => set((s) => ({
        playlists: [
          ...s.playlists,
          { id: Date.now().toString(), name: name ?? `プレイリスト ${s.playlists.length + 1}`, tracks: [] }
        ]
      })),

      deletePlaylist: (id) => set((s) => {
        const next = s.playlists.filter(p => p.id !== id)
        return {
          playlists: next,
          activePlaylistId: s.activePlaylistId === id ? (next[0]?.id ?? 'default') : s.activePlaylistId,
        }
      }),

      renamePlaylist: (id, name) => set((s) => ({
        playlists: s.playlists.map(p => p.id === id ? { ...p, name } : p)
      })),

      addTrack: (playlistId, track, sceneName, sceneIcon) => set((s) => ({
        playlists: s.playlists.map(p =>
          p.id !== playlistId ? p :
          p.tracks.some(t => String(t.id) === String(track.id)) ? p :
          { ...p, tracks: [...p.tracks, { ...track, sceneName, sceneIcon }] }
        )
      })),

      removeTrack: (playlistId, trackId) => set((s) => ({
        playlists: s.playlists.map(p =>
          p.id !== playlistId ? p :
          { ...p, tracks: p.tracks.filter(t => String(t.id) !== trackId) }
        )
      })),

      hasTrack: (playlistId, trackId) => {
        const pl = get().playlists.find(p => p.id === playlistId)
        return pl ? pl.tracks.some(t => String(t.id) === trackId) : false
      },
    }),
    { name: 'scenebgm-playlists' }
  )
)
