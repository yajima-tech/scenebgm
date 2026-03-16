import type { AppTab } from '../../types'
import { useAppStore } from '../../store/appStore'

const TABS: { key: AppTab; label: string }[] = [
  { key: 'bgm',    label: 'BGM' },
  { key: 'se',     label: 'SE' },
  { key: 'search', label: '検索' },
  { key: 'aigen',  label: '✦ AI生成' },
]

export function Topbar() {
  const { currentTab, setTab } = useAppStore()

  return (
    <header
      className="flex items-center justify-between"
      style={{
        gridColumn: '1 / -1',
        background: '#13161e',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        height: 60,
        padding: '0 24px',
        gap: 20,
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span
          className="font-bold tracking-tight"
          style={{ fontFamily: "'DM Mono', monospace", color: 'var(--accent)', fontSize: 20 }}
        >
          sceneBGM
        </span>
      </div>

      {/* Center: Tabs */}
      <div className="flex gap-1 rounded-lg p-1" style={{ background: 'var(--bg3)' }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="rounded-md font-semibold transition-all cursor-pointer"
            style={{
              background: currentTab === key ? 'var(--accent)' : 'transparent',
              color: currentTab === key ? 'var(--bg)' : 'var(--muted2)',
              fontSize: 14,
              padding: '8px 18px',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right: AI button + avatar */}
      <div className="flex items-center gap-3">
        <button
          className="px-3 py-1 rounded-md text-xs font-medium border cursor-pointer"
          style={{
            borderColor: 'var(--border-hi)',
            color: 'var(--muted2)',
            background: 'transparent',
          }}
        >
          ✦ AI生成 (Phase 2)
        </button>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'var(--bg3)', color: 'var(--muted2)' }}
        >
          U
        </div>
      </div>
    </header>
  )
}
