import { usePlaylistStore } from '../../store/playlistStore'
import { useSearchStore } from '../../store/searchStore'
import { TrackCard } from '../search/TrackCard'

export function PlaylistPanel() {
  const { playlists, activePlaylistId } = usePlaylistStore()
  const { results } = useSearchStore()

  const pl = playlists.find(p => p.id === activePlaylistId) ?? playlists[0]
  if (!pl) return null

  const pinnedTracks = results.filter(t => t.pinned && t.pinnedToPlaylistId === pl.id)

  return (
    <div style={{ padding: 20 }} className="h-full overflow-y-auto">
      <div className="view-header">
        <span style={{ fontSize: 28 }}>🎵</span>
        <div>
          <div className="view-title">{pl.name}</div>
          <div className="view-sub">ピン済み: {pinnedTracks.length}曲</div>
        </div>
      </div>

      {pinnedTracks.length === 0 ? (
        <div className="empty-hint">
          <p>「検索」タブで楽曲を検索し、📌ボタンでプレイリストに追加してください</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pinnedTracks.map(t => <TrackCard key={t.id} track={t} />)}
        </div>
      )}
    </div>
  )
}
