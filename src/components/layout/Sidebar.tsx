import { useState } from 'react'
import type { Tab } from '../../types'
import { SCENES } from '../../data/scenes'
import { SE_CATS } from '../../data/seCats'
import { useBGMStore } from '../../store/bgmStore'
import { useSEStore, SE_LIVESET_ID } from '../../store/seStore'
import { usePlaylistStore } from '../../store/playlistStore'

const PLAYLIST_PREFIX = '__playlist__'

interface Props {
  tab: Tab
}

export function Sidebar({ tab }: Props) {
  return (
    <aside
      style={{
        width: 260,
        background: '#13161e',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        padding: 16,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {tab === 'bgm' ? <BGMSidebar /> : <SESidebar />}
    </aside>
  )
}

function BGMSidebar() {
  const { currentSceneId, setScene } = useBGMStore()
  const { playlists, setActivePlaylist, createPlaylist, deletePlaylist, renamePlaylist } = usePlaylistStore()

  function selectPlaylist(id: string) {
    setActivePlaylist(id)
    setScene(PLAYLIST_PREFIX + id)
  }

  return (
    <div className="flex flex-col">
      {/* Playlists */}
      <span style={{ fontSize: 11, color: '#6b6a64', padding: '4px 12px 6px', letterSpacing: 1, textTransform: 'uppercase' }}>
        プレイリスト
      </span>
      {playlists.map((pl) => (
        <PlaylistItem
          key={pl.id}
          playlist={pl}
          isActive={currentSceneId === PLAYLIST_PREFIX + pl.id}
          onSelect={() => selectPlaylist(pl.id)}
          onRename={(name) => renamePlaylist(pl.id, name)}
          onDelete={() => deletePlaylist(pl.id)}
          canDelete={playlists.length > 1}
        />
      ))}
      <button className="pl-add-btn" onClick={() => createPlaylist()}>
        <span>+</span> 新規プレイリスト
      </button>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 4px 8px' }} />

      {/* Scenes */}
      <span style={{ fontSize: 11, color: '#6b6a64', padding: '4px 12px 6px', letterSpacing: 1, textTransform: 'uppercase' }}>
        シーン
      </span>
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

function PlaylistItem({
  playlist,
  isActive,
  onSelect,
  onRename,
  onDelete,
  canDelete,
}: {
  playlist: { id: string; name: string; tracks: { id: number }[] }
  isActive: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onDelete: () => void
  canDelete: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(playlist.name)

  if (editing) {
    return (
      <div className="playlist-item editing">
        <span className="playlist-icon">🎵</span>
        <input
          autoFocus
          value={draftName}
          onChange={e => setDraftName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { onRename(draftName); setEditing(false) } }}
          onBlur={() => { onRename(draftName); setEditing(false) }}
        />
      </div>
    )
  }

  return (
    <button
      className={`playlist-item${isActive ? ' active' : ''}`}
      onClick={onSelect}
    >
      <span className="playlist-icon">🎵</span>
      <span className="playlist-name">{playlist.name}</span>
      <span className="playlist-count">{playlist.tracks.length}</span>
      <span className="pl-edit-btn" onClick={e => { e.stopPropagation(); setDraftName(playlist.name); setEditing(true) }}>✏</span>
      {canDelete && (
        <span className="pl-del-btn" onClick={e => { e.stopPropagation(); onDelete() }}>×</span>
      )}
    </button>
  )
}

function SESidebar() {
  const { currentCatId, setCat, pinnedIds } = useSEStore()

  return (
    <div className="flex flex-col">
      {/* Live Set */}
      <SidebarItem
        icon="🎬"
        label="本番セット"
        badge={pinnedIds.size}
        active={currentCatId === SE_LIVESET_ID}
        onClick={() => setCat(SE_LIVESET_ID)}
        accent="live"
      />

      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 4px 8px' }} />

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
      ? 'rgba(224,85,85,0.08)'
      : accent === 'se'
        ? 'rgba(176,106,232,0.12)'
        : 'rgba(232,185,106,0.10)'
  const accentColor =
    accent === 'live'
      ? '#e05555'
      : accent === 'se'
        ? 'var(--accent3)'
        : 'var(--accent)'
  const activeBorder = active ? accentColor : 'transparent'
  const textColor = active
    ? accent === 'live'
      ? '#e05555'
      : accent === 'se'
        ? 'var(--accent3)'
        : 'var(--text)'
    : accent === 'live'
      ? '#e05555'
      : '#9e9d97'

  return (
    <button
      onClick={onClick}
      className="flex items-center text-left cursor-pointer"
      style={{
        gap: 12,
        padding: '10px 12px',
        borderRadius: 10,
        border: active ? `1px solid ${activeBorder}` : '1px solid transparent',
        background: active ? bgActive : 'transparent',
        color: textColor,
        transition: 'all 0.15s',
        marginBottom: 3,
      }}
      onMouseEnter={(e) => {
        if (!active && accent === 'live') {
          e.currentTarget.style.color = '#e05555'
        }
      }}
      onMouseLeave={(e) => {
        if (!active && accent === 'live') {
          e.currentTarget.style.color = '#e05555'
        }
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span className="flex-1 truncate font-medium" style={{ fontSize: 15 }}>{label}</span>
      {sub && (
        <span style={{ color: 'var(--muted)', fontSize: 11 }}>{sub}</span>
      )}
      {badge !== undefined && badge > 0 && (
        <span
          className="px-1.5 py-0.5 rounded-full font-bold"
          style={{
            background: accent === 'live' ? 'var(--live)' : 'var(--accent)',
            color: 'var(--bg)',
            fontSize: 11,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
