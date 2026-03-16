import { create } from 'zustand'
import type { AppTab } from '../types'

interface AppState {
  currentTab: AppTab
  setTab: (tab: AppTab) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentTab: 'search',
  setTab: (tab) => set({ currentTab: tab }),
}))
