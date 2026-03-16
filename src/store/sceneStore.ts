import { create } from 'zustand'
import type { Scene } from '../types'

export const SCENES: Scene[] = [
  { id: 'nyuure',  icon: '🚪', name: '客入れ' },
  { id: 'toudan',  icon: '🎤', name: '登壇' },
  { id: 'award',   icon: '🏆', name: 'アワード' },
  { id: 'kanpai',  icon: '🥂', name: '乾杯' },
  { id: 'kandan',  icon: '🍻', name: '歓談' },
]

interface SceneState {
  currentSceneId: string
  setScene: (id: string) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  currentSceneId: 'nyuure',
  setScene: (id) => set({ currentSceneId: id }),
}))
