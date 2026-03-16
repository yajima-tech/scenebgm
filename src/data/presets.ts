// Freesound CC0楽曲のプリセット
// 各オブジェクトのidはFreesoundのトラックID（number）

import type { FreesoundTrack } from '../types'

export interface PresetTrack {
  id: number
  name: string
  bpm: number | null
  duration: number
  tags: string[]
  previewUrl: string
  sceneId: string
}

export const PRESET_TRACKS: PresetTrack[] = [
  // 客入れ
  { id: 536757, name: 'Jazz Cafe Background',        bpm: 90,  duration: 187, tags: ['jazz','piano','lounge'],   previewUrl: 'https://cdn.freesound.org/previews/536/536757_11861866-hq.mp3', sceneId: 'nyuure' },
  { id: 612425, name: 'Acoustic Guitar Lounge',      bpm: 84,  duration: 213, tags: ['guitar','acoustic'],       previewUrl: 'https://cdn.freesound.org/previews/612/612425_5674468-hq.mp3',  sceneId: 'nyuure' },
  { id: 456529, name: 'Bossa Nova Piano',            bpm: 88,  duration: 195, tags: ['bossa','piano'],           previewUrl: 'https://cdn.freesound.org/previews/456/456529_9154947-hq.mp3',  sceneId: 'nyuure' },
  { id: 388484, name: 'Smooth Jazz Background',      bpm: 92,  duration: 240, tags: ['jazz','smooth'],           previewUrl: 'https://cdn.freesound.org/previews/388/388484_7107869-hq.mp3',  sceneId: 'nyuure' },
  { id: 431163, name: 'Piano Jazz Lounge',           bpm: 86,  duration: 178, tags: ['piano','jazz'],            previewUrl: 'https://cdn.freesound.org/previews/431/431163_8004218-hq.mp3',  sceneId: 'nyuure' },

  // 登壇
  { id: 476178, name: 'Orchestral Entrance',         bpm: 120, duration: 52,  tags: ['orchestral','entrance'],   previewUrl: 'https://cdn.freesound.org/previews/476/476178_9810644-hq.mp3',  sceneId: 'toudan' },
  { id: 414738, name: 'Fanfare Brass Short',         bpm: 110, duration: 8,   tags: ['fanfare','brass'],         previewUrl: 'https://cdn.freesound.org/previews/414/414738_5121236-hq.mp3',  sceneId: 'toudan' },
  { id: 456115, name: 'Epic Cinematic Intro',        bpm: 128, duration: 65,  tags: ['epic','cinematic'],        previewUrl: 'https://cdn.freesound.org/previews/456/456115_9154947-hq.mp3',  sceneId: 'toudan' },
  { id: 387103, name: 'March Ceremonial',            bpm: 112, duration: 43,  tags: ['march','ceremonial'],      previewUrl: 'https://cdn.freesound.org/previews/387/387103_7107869-hq.mp3',  sceneId: 'toudan' },
  { id: 523167, name: 'Grand Entrance Theme',        bpm: 116, duration: 38,  tags: ['grand','entrance'],        previewUrl: 'https://cdn.freesound.org/previews/523/523167_11072546-hq.mp3', sceneId: 'toudan' },

  // アワード
  { id: 612348, name: 'Award Ceremony Theme',        bpm: 96,  duration: 85,  tags: ['award','orchestral'],      previewUrl: 'https://cdn.freesound.org/previews/612/612348_5674468-hq.mp3',  sceneId: 'award' },
  { id: 388100, name: 'Triumphant Orchestra',        bpm: 108, duration: 72,  tags: ['triumphant','orchestra'],  previewUrl: 'https://cdn.freesound.org/previews/388/388100_7107869-hq.mp3',  sceneId: 'award' },
  { id: 476002, name: 'Achievement Unlocked',        bpm: 120, duration: 15,  tags: ['achievement','brass'],     previewUrl: 'https://cdn.freesound.org/previews/476/476002_9810644-hq.mp3',  sceneId: 'award' },
  { id: 431050, name: 'Celebration Brass',           bpm: 114, duration: 28,  tags: ['celebration','brass'],     previewUrl: 'https://cdn.freesound.org/previews/431/431050_8004218-hq.mp3',  sceneId: 'award' },
  { id: 414800, name: 'Victory Fanfare',             bpm: 130, duration: 12,  tags: ['victory','fanfare'],       previewUrl: 'https://cdn.freesound.org/previews/414/414800_5121236-hq.mp3',  sceneId: 'award' },

  // 乾杯
  { id: 523200, name: 'Party Jazz Upbeat',           bpm: 130, duration: 95,  tags: ['jazz','party','upbeat'],   previewUrl: 'https://cdn.freesound.org/previews/523/523200_11072546-hq.mp3', sceneId: 'kanpai' },
  { id: 456700, name: 'Champagne Pop Jazz',          bpm: 124, duration: 110, tags: ['jazz','festive'],          previewUrl: 'https://cdn.freesound.org/previews/456/456700_9154947-hq.mp3',  sceneId: 'kanpai' },
  { id: 388600, name: 'Celebration Swing',           bpm: 136, duration: 88,  tags: ['swing','celebration'],     previewUrl: 'https://cdn.freesound.org/previews/388/388600_7107869-hq.mp3',  sceneId: 'kanpai' },
  { id: 431500, name: 'Festive Brass Band',          bpm: 128, duration: 75,  tags: ['brass','festive'],         previewUrl: 'https://cdn.freesound.org/previews/431/431500_8004218-hq.mp3',  sceneId: 'kanpai' },
  { id: 476500, name: 'Happy Fanfare',               bpm: 140, duration: 18,  tags: ['fanfare','happy'],         previewUrl: 'https://cdn.freesound.org/previews/476/476500_9810644-hq.mp3',  sceneId: 'kanpai' },

  // 歓談
  { id: 536800, name: 'Lounge Funk Groove',          bpm: 108, duration: 225, tags: ['funk','groove','lounge'],  previewUrl: 'https://cdn.freesound.org/previews/536/536800_11861866-hq.mp3', sceneId: 'kandan' },
  { id: 612500, name: 'Upbeat Swing Jazz',           bpm: 116, duration: 198, tags: ['swing','jazz','upbeat'],   previewUrl: 'https://cdn.freesound.org/previews/612/612500_5674468-hq.mp3',  sceneId: 'kandan' },
  { id: 456800, name: 'Party Background Jazz',       bpm: 112, duration: 210, tags: ['jazz','party'],            previewUrl: 'https://cdn.freesound.org/previews/456/456800_9154947-hq.mp3',  sceneId: 'kandan' },
  { id: 388700, name: 'Cocktail Jazz Piano',         bpm: 104, duration: 235, tags: ['jazz','piano','cocktail'], previewUrl: 'https://cdn.freesound.org/previews/388/388700_7107869-hq.mp3',  sceneId: 'kandan' },
  { id: 431600, name: 'Social Gathering Music',      bpm: 98,  duration: 245, tags: ['lounge','social'],         previewUrl: 'https://cdn.freesound.org/previews/431/431600_8004218-hq.mp3',  sceneId: 'kandan' },
]

export function getPresetAsFreesoundTracks(): FreesoundTrack[] {
  const savedTags = (() => {
    try {
      const raw = localStorage.getItem('scenebgm-track-tags')
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })()

  return PRESET_TRACKS.map(p => {
    const saved = savedTags[String(p.id)]
    return {
      id: p.id,
      name: p.name,
      bpm: p.bpm,
      duration: p.duration,
      tags: p.tags,
      previews: { 'preview-hq-mp3': p.previewUrl },
      license: 'http://creativecommons.org/publicdomain/zero/1.0/',
      scenes: saved ? new Set<string>(saved.scenes) : new Set([p.sceneId]),
      pinned: saved?.pinned ?? false,
      pinnedToPlaylistId: saved?.pinnedToPlaylistId ?? null,
    }
  })
}
