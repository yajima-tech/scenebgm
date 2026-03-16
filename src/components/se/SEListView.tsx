import { useState, useCallback } from 'react'
import type { SEItem } from '../../types'
import { useSEStore } from '../../store/seStore'
import { SE_PLAY_MAP } from '../../audio/seEngine'

interface Props {
  items: SEItem[]
  isLive?: boolean
}

export function SEListView({ items, isLive }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <SEListRow key={item.id} item={item} isLive={isLive} />
      ))}
    </div>
  )
}

function SEListRow({ item, isLive }: { item: SEItem; isLive?: boolean }) {
  const { pinnedIds, togglePin } = useSEStore()
  const pinned = pinnedIds.has(item.id)
  const [firing, setFiring] = useState(false)

  const handlePlay = useCallback(() => {
    SE_PLAY_MAP[item.id]?.()
    setFiring(true)
    setTimeout(() => setFiring(false), 500)
  }, [item.id])

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
      style={{
        background: firing
          ? isLive ? 'rgba(224,85,85,0.12)' : 'rgba(176,106,232,0.10)'
          : 'var(--bg2)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Play button */}
      <button
        onClick={handlePlay}
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 cursor-pointer"
        style={{
          background: 'transparent',
          border: isLive ? '1px solid var(--live)' : '1px solid var(--accent3)',
          color: isLive ? 'var(--live)' : 'var(--accent3)',
        }}
      >
        ▶
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{item.emoji}</span>
          <span className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
            {item.name}
          </span>
          {item.tags.map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded shrink-0"
              style={{ background: 'var(--bg3)', color: 'var(--muted2)', fontSize: 10 }}
            >
              {t}
            </span>
          ))}
        </div>
        <p className="text-xs truncate" style={{ color: 'var(--muted2)' }}>{item.sub}</p>
      </div>

      {/* Duration */}
      <span
        className="text-xs shrink-0"
        style={{ color: 'var(--muted2)', fontFamily: "'DM Mono', monospace" }}
      >
        {item.dur}
      </span>

      {/* Pin */}
      <button
        onClick={() => togglePin(item.id)}
        className="shrink-0 flex items-center justify-center cursor-pointer"
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: pinned ? '1px solid #e8b96a' : '1px solid var(--border-hi)',
          background: pinned ? 'var(--accent)' : 'var(--bg3)',
          color: pinned ? '#0d0f14' : 'var(--muted)',
          boxShadow: pinned
            ? '0 0 8px rgba(232,185,106,0.6), 0 0 20px rgba(232,185,106,0.25)'
            : 'none',
          transition: 'all 0.2s',
          fontSize: 12,
        }}
      >
        📌
      </button>
    </div>
  )
}
