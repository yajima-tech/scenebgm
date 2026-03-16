import type { FreesoundTrack } from '../types'

const TAG_KEY   = 'scenebgm-track-tags'
const TRACK_KEY = 'scenebgm-track-data'

export function saveTracksToStorage(results: FreesoundTrack[]) {
  const tagData:   Record<string, { scenes: string[]; pinned: boolean; pinnedToPlaylistId: string | null }> = {}
  const trackData: Record<string, object> = {}

  results.forEach(t => {
    if (t.scenes.size > 0 || t.pinned) {
      const id = String(t.id)
      tagData[id] = {
        scenes: Array.from(t.scenes),
        pinned: t.pinned,
        pinnedToPlaylistId: t.pinnedToPlaylistId ?? null,
      }
      trackData[id] = {
        id: t.id,
        name: t.name,
        bpm: t.bpm,
        duration: t.duration,
        tags: t.tags,
        previewUrl: t.previews['preview-hq-mp3'],
        license: t.license,
        scenes: Array.from(t.scenes),
        pinned: t.pinned,
        pinnedToPlaylistId: t.pinnedToPlaylistId ?? null,
      }
    }
  })

  localStorage.setItem(TAG_KEY,   JSON.stringify(tagData))
  localStorage.setItem(TRACK_KEY, JSON.stringify(trackData))
}

export function loadSavedTracks(): FreesoundTrack[] {
  try {
    const raw = localStorage.getItem(TRACK_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as Record<string, Record<string, unknown>>
    return Object.values(data).map((t) => ({
      id: t.id as number,
      name: t.name as string,
      bpm: (t.bpm as number | null) ?? null,
      duration: (t.duration as number) ?? 0,
      tags: (t.tags as string[]) ?? [],
      previews: { 'preview-hq-mp3': (t.previewUrl as string) ?? '' },
      license: (t.license as string) ?? '',
      scenes: new Set<string>((t.scenes as string[]) ?? []),
      pinned: (t.pinned as boolean) ?? false,
      pinnedToPlaylistId: (t.pinnedToPlaylistId as string | null) ?? null,
    }))
  } catch {
    return []
  }
}

export function loadTagsMap(): Record<string, { scenes: string[]; pinned: boolean }> {
  try {
    const raw = localStorage.getItem(TAG_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
