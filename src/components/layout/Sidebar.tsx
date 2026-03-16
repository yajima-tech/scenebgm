import { useState } from 'react'
import { SCENES } from '../../store/sceneStore'
import { useSceneStore } from '../../store/sceneStore'
import { useSearchStore } from '../../store/searchStore'
import { usePlaylistStore } from '../../store/playlistStore'
import { useAppStore } from '../../store/appStore'

export function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: '#13161e',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        padding: 16,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <SceneSidebar />
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '12px 0' }} />
      <PlaylistSidebar />
    </aside>
  )
}

function SceneSidebar() {
  const { currentSceneId, setScene } = useSceneStore()
  const { results, initFiltersForScene } = useSearchStore()
  const { currentTab, setTab } = useAppStore()

  return (
    <div className="flex flex-col">
      <span style={{ fontSize: 11, color: '#6b6a64', padding: '4px 12px 6px', letterSpacing: 1, textTransform: 'uppercase' }}>
        シーン
      </span>
      {SCENES.map((s) => {
        const count = results.filter(t => t.scenes.has(s.id)).length
        return (
          <SidebarItem
            key={s.id}
            icon={s.icon}
            label={s.name}
            sub={count > 0 ? `${count}曲` : undefined}
            active={currentTab === 'bgm' && currentSceneId === s.id}
            onClick={() => { setScene(s.id); setTab('bgm'); initFiltersForScene(s) }}
          />
        )
      })}
    </div>
  )
}

function PlaylistSidebar() {
  const { playlists, activePlaylistId, setActivePlaylist, createPlaylist, deletePlaylist, renamePlaylist } = usePlaylistStore()

  return (
    <div className="flex flex-col">
      <span style={{ fontSize: 11, color: '#6b6a64', padding: '4px 12px 6px', letterSpacing: 1, textTransform: 'uppercase' }}>
        プレイリスト
      </span>
      {playlists.map((pl) => (
        <PlaylistItem
          key={pl.id}
          playlist={pl}
          isActive={activePlaylistId === pl.id}
          onSelect={() => setActivePlaylist(pl.id)}
          onRename={(name) => renamePlaylist(pl.id, name)}
          onDelete={() => deletePlaylist(pl.id)}
          canDelete={playlists.length > 1}
        />
      ))}
      <button className="pl-add-btn" onClick={() => createPlaylist()}>
        <span>+</span> 新規プレイリスト
      </button>
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

function SidebarItem({
  icon,
  label,
  sub,
  active,
  onClick,
}: {
  icon: string
  label: string
  sub?: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-left cursor-pointer"
      style={{
        gap: 12,
        padding: '10px 12px',
        borderRadius: 10,
        border: active ? '1px solid rgba(232,185,106,0.25)' : '1px solid transparent',
        background: active ? 'rgba(232,185,106,0.10)' : 'transparent',
        color: active ? 'var(--text)' : '#9e9d97',
        transition: 'all 0.15s',
        marginBottom: 3,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span className="flex-1 truncate font-medium" style={{ fontSize: 15 }}>{label}</span>
      {sub && (
        <span style={{ color: 'var(--muted)', fontSize: 11 }}>{sub}</span>
      )}
    </button>
  )
}
