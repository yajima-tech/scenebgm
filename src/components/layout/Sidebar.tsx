import type { Tab } from '../../types'
import { SCENES } from '../../data/scenes'
import { SE_CATS } from '../../data/seCats'
import { useBGMStore, BGM_LIVESET_ID } from '../../store/bgmStore'
import { useSEStore, SE_LIVESET_ID } from '../../store/seStore'

interface Props {
  tab: Tab
}

export function Sidebar({ tab }: Props) {
  return (
    <aside
      style={{
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {tab === 'bgm' ? <BGMSidebar /> : <SESidebar />}
    </aside>
  )
}

function BGMSidebar() {
  const { currentSceneId, setScene, pinnedIds } = useBGMStore()

  return (
    <div className="flex flex-col py-2">
      {/* Live Set */}
      <SidebarItem
        icon="🎬"
        label="本番セット"
        badge={pinnedIds.size}
        active={currentSceneId === BGM_LIVESET_ID}
        onClick={() => setScene(BGM_LIVESET_ID)}
        accent="live"
      />

      <div className="mx-3 my-2" style={{ borderTop: '1px solid var(--border)' }} />

      {/* Scenes */}
      {SCENES.map((s) => (
        <SidebarItem
          key={s.id}
          icon={s.icon}
          label={s.name}
          sub={s.count}
          active={currentSceneId === s.id}
          onClick={() => setScene(s.id)}
        />
      ))}
    </div>
  )
}

function SESidebar() {
  const { currentCatId, setCat, pinnedIds } = useSEStore()

  return (
    <div className="flex flex-col py-2">
      {/* Live Set */}
      <SidebarItem
        icon="🎬"
        label="本番セット"
        badge={pinnedIds.size}
        active={currentCatId === SE_LIVESET_ID}
        onClick={() => setCat(SE_LIVESET_ID)}
        accent="live"
      />

      <div className="mx-3 my-2" style={{ borderTop: '1px solid var(--border)' }} />

      {/* Categories */}
      {SE_CATS.map((c) => (
        <SidebarItem
          key={c.id}
          icon={c.icon}
          label={c.name}
          sub={`${c.items.length}件`}
          active={currentCatId === c.id}
          onClick={() => setCat(c.id)}
          accent="se"
        />
      ))}
    </div>
  )
}

function SidebarItem({
  icon,
  label,
  sub,
  badge,
  active,
  onClick,
  accent,
}: {
  icon: string
  label: string
  sub?: string
  badge?: number
  active: boolean
  onClick: () => void
  accent?: 'live' | 'se'
}) {
  const bgActive =
    accent === 'live'
      ? 'rgba(224,85,85,0.12)'
      : accent === 'se'
        ? 'rgba(176,106,232,0.12)'
        : 'rgba(232,185,106,0.10)'
  const accentColor =
    accent === 'live'
      ? 'var(--live)'
      : accent === 'se'
        ? 'var(--accent3)'
        : 'var(--accent)'
  const borderLeftColor = active ? accentColor : 'transparent'
  const textColor = active
    ? accent === 'live'
      ? 'var(--live)'
      : accent === 'se'
        ? 'var(--accent3)'
        : 'var(--text)'
    : 'var(--muted2)'

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-left text-sm cursor-pointer"
      style={{
        background: active ? bgActive : 'transparent',
        borderLeft: `3px solid ${borderLeftColor}`,
        color: textColor,
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        if (!active && accent === 'live') {
          e.currentTarget.style.color = 'var(--live)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active && accent === 'live') {
          e.currentTarget.style.color = 'var(--muted2)'
        }
      }}
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1 truncate font-medium">{label}</span>
      {sub && (
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{sub}</span>
      )}
      {badge !== undefined && badge > 0 && (
        <span
          className="text-xs px-1.5 py-0.5 rounded-full font-bold"
          style={{
            background: accent === 'live' ? 'var(--live)' : 'var(--accent)',
            color: 'var(--bg)',
            fontSize: 10,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
