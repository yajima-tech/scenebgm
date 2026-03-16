export type Tab = 'bgm' | 'se'

export interface Track {
  id: string
  name: string
  tags: string[]
  mood: string
  bpm: number
  dur: string
  score: number
}

export interface Scene {
  id: string
  icon: string
  name: string
  sub: string
  bpm: string
  mood: string
  dur: string
  count: string
  tracks: Track[]
}

export interface TrackParam {
  bpm: number
  pitch: number
}

export interface PinnedTrack extends Track {
  sceneName: string
  sceneIcon: string
}

export interface Playlist {
  id: string
  name: string
  trackIds: string[]
}

export interface SEItem {
  id: string
  emoji: string
  name: string
  sub: string
  tags: string[]
  dur: string
}

export interface SECategory {
  id: string
  icon: string
  name: string
  sub: string
  items: SEItem[]
}
