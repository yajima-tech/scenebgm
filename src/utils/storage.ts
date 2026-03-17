import type { FreesoundTrack } from '../types'

const KEY = 'scenebgm-tracks-v3'

export function saveTracks(tracks: FreesoundTrack[]) {
  const data: Record<string, object> = {}
  tracks.forEach(t => {
    if (t.scenes.size > 0 || t.pinned) {
      data[String(t.id)] = {
        id: t.id, name: t.name, bpm: t.bpm,
        duration: t.duration, tags: t.tags,
        previewUrl: t.previews['preview-hq-mp3'],
        license: t.license,
        scenes: Array.from(t.scenes),
        pinned: t.pinned,
        pinnedToPlaylistId: t.pinnedToPlaylistId ?? null,
      }
    }
  })
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function loadTracks(): FreesoundTrack[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return Object.values(JSON.parse(raw)).map((t: Record<string, unknown>) => ({
      id: t.id as number, name: t.name as string, bpm: (t.bpm as number | null) ?? null,
      duration: (t.duration as number) ?? 0, tags: (t.tags as string[]) ?? [],
      previews: { 'preview-hq-mp3': (t.previewUrl as string) ?? '' },
      license: (t.license as string) ?? '',
      scenes: new Set<string>((t.scenes as string[]) ?? []),
      pinned: (t.pinned as boolean) ?? false,
      pinnedToPlaylistId: (t.pinnedToPlaylistId as string | null) ?? null,
    }))
  } catch { return [] }
}
