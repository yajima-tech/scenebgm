import { useState, useCallback } from 'react'
import type { SEItem } from '../../types'
import { useSEStore } from '../../store/seStore'
import { SE_PLAY_MAP } from '../../audio/seEngine'

interface Props {
  items: SEItem[]
  isLive?: boolean
}

export function SEPadGrid({ items, isLive }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
      }}
    >
      {items.map((item) => (
        <SEPad key={item.id} item={item} isLive={isLive} />
      ))}
    </div>
  )
}

function SEPad({ item, isLive }: { item: SEItem; isLive?: boolean }) {
  const { pinnedIds, togglePin } = useSEStore()
  const pinned = pinnedIds.has(item.id)
  const [firing, setFiring] = useState(false)
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null)

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Play SE
    SE_PLAY_MAP[item.id]?.()

    // Firing effect
    setFiring(true)
    setTimeout(() => setFiring(false), 500)

    // Ripple
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      key: Date.now(),
    })
    setTimeout(() => setRipple(null), 450)
  }, [item.id])

  const borderColor = firing
    ? isLive ? 'var(--live)' : 'var(--accent3)'
    : 'var(--border-hi)'

  const bgColor = firing
    ? isLive ? 'rgba(224,85,85,0.15)' : 'rgba(176,106,232,0.12)'
    : 'var(--bg2)'

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer select-none"
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        minHeight: 100,
        padding: 14,
        overflow: 'hidden',
        transition: 'transform 0.18s, border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.borderColor = isLive ? 'var(--live)' : 'var(--accent3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        if (!firing) e.currentTarget.style.borderColor = 'var(--border-hi)'
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
    >
      {/* Ripple */}
      {ripple && (
        <div
          key={ripple.key}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: isLive ? 'rgba(224,85,85,0.3)' : 'rgba(176,106,232,0.3)',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'se-ripple 0.45s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top: emoji + dur */}
      <div className="flex items-start justify-between mb-1">
        <span style={{ fontSize: 22 }}>{item.emoji}</span>
        <span
          className="text-xs"
          style={{ color: 'var(--muted2)', fontFamily: "'DM Mono', monospace" }}
        >
          {item.dur}
        </span>
      </div>

      {/* Name */}
      <div className="font-semibold mb-0.5" style={{ color: 'var(--text)', fontSize: 13 }}>
        {item.name}
      </div>

      {/* Sub */}
      <div className="mb-2" style={{ color: 'var(--muted2)', fontSize: 11 }}>
        {item.sub}
      </div>

      {/* Bottom: tags + pin */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {item.tags.map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg3)', color: 'var(--muted2)', fontSize: 10 }}
            >
              {t}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            togglePin(item.id)
          }}
          className="flex items-center justify-center cursor-pointer"
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
    </div>
  )
}
