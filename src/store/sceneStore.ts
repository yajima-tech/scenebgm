import { create } from 'zustand'
import type { Scene } from '../types'

export const SCENES: Scene[] = [
  {
    id: 'nyuure', icon: '🚪', name: '客入れ',
    defaultMoods: ['わくわく'],
    defaultInsts: ['ピアノ'],
  },
  {
    id: 'toudan', icon: '🎤', name: '登壇',
    defaultMoods: ['高揚'],
    defaultInsts: ['ピアノ', 'ストリングス'],
  },
  {
    id: 'award', icon: '🏆', name: 'アワード',
    defaultMoods: ['わくわく'],
    defaultInsts: ['オーケストラ'],
  },
  {
    id: 'kanpai', icon: '🥂', name: '乾杯',
    defaultMoods: [],
    defaultInsts: [],
  },
  {
    id: 'kandan', icon: '🍻', name: '歓談',
    defaultMoods: [],
    defaultInsts: [],
  },
  {
    id: 'kyakudashi', icon: '🌅', name: '客出し',
    defaultMoods: [],
    defaultInsts: [],
  },
]

interface SceneState {
  currentSceneId: string
  setScene: (id: string) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  currentSceneId: 'nyuure',
  setScene: (id) => set({ currentSceneId: id }),
}))
