import { create } from 'zustand'
import type { Scene } from '../types'

export const SCENES: Scene[] = [
  { id: 'nyuure',       icon: '🚪', name: '客入れ' },
  { id: 'opening',      icon: '🎬', name: 'オープニング' },
  { id: 'toudan_kodan', icon: '🎤', name: '登壇／降壇' },
  { id: 'kyuukei',      icon: '☕', name: '休憩' },
  { id: 'award',        icon: '🏆', name: 'アワード' },
  { id: 'kanpai',       icon: '🥂', name: '乾杯' },
  { id: 'konshin',      icon: '🍻', name: '懇親会' },
]

interface SceneState {
  currentSceneId: string
  setScene: (id: string) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  currentSceneId: 'nyuure',
  setScene: (id) => set({ currentSceneId: id }),
}))
