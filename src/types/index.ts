export type AppTab = 'bgm' | 'se' | 'search' | 'aigen'

export interface FreesoundTrack {
  id: number
  name: string
  bpm: number | null
  duration: number
  tags: string[]
  previews: { 'preview-hq-mp3': string }
  license: string
  scenes: Set<string>
  pinned: boolean
  pinnedToPlaylistId: string | null
}

export interface Scene {
  id: string
  icon: string
  name: string
  defaultMoods: string[]
  defaultInsts: string[]
}

export interface Playlist {
  id: string
  name: string
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
