import type { Tab } from '../../types'

interface Props {
  tab: Tab
  onTabChange: (t: Tab) => void
}

export function Topbar({ tab, onTabChange }: Props) {
  return (
    <header
      className="flex items-center justify-between px-5"
      style={{
        gridColumn: '1 / -1',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        height: 52,
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: "'DM Mono', monospace", color: 'var(--accent)' }}
        >
          sceneBGM
        </span>
      </div>

      {/* Center: Tabs */}
      <div className="flex gap-1 rounded-lg p-1" style={{ background: 'var(--bg3)' }}>
        {(['bgm', 'se'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className="px-4 py-1 rounded-md text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? 'var(--bg)' : 'var(--muted2)',
            }}
          >
            {t.toUpperCase()}
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
