import type { FreesoundTrack } from '../../types'
import { useSearchStore } from '../../store/searchStore'
import { usePlaylistStore } from '../../store/playlistStore'
import { useAudioPlayer } from '../../store/audioPlayerStore'
import { SCENES } from '../../store/sceneStore'

interface Props {
  track: FreesoundTrack
}

function formatDur(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function TrackCard({ track }: Props) {
  const { toggleScene, togglePin } = useSearchStore()
  const { playlists, activePlaylistId } = usePlaylistStore()
  const effectivePlaylistId = activePlaylistId ?? playlists[0]?.id ?? 'default'
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer()
  const isCurrentTrack = currentTrack?.id === track.id
  const isCurrentPlaying = isCurrentTrack && isPlaying

  const handlePlay = () => {
    if (isCurrentTrack) { pause() } else { play(track) }
  }

  return (
    <div className="track">
      {/* メイン行 */}
      <div className="track-main">
        <button
          className={`play-btn${isCurrentPlaying ? ' playing' : ''}`}
          onClick={handlePlay}
        >
          {isCurrentPlaying ? '▐▐' : '▶'}
        </button>
        <div className="track-info">
          <div className="t-name">
            {track.name}
            {[...track.scenes].map(sid => {
              const s = SCENES.find(x => x.id === sid)
              return s ? <span key={sid} className="scene-badge">{s.icon} {s.name}</span> : null
            })}
          </div>
          <div className="t-meta">
            {track.tags.slice(0, 3).map(g => <span key={g} className="t-tag">{g}</span>)}
            {track.bpm && <span className="t-bpm">{Math.round(track.bpm)} BPM</span>}
            <span className="t-dur">{formatDur(track.duration)}</span>
            <span className="t-cc0">CC0</span>
          </div>
        </div>
        <button
          className={`pin-btn${track.pinned ? ' on' : ''}`}
          onClick={() => togglePin(track.id, effectivePlaylistId)}
          title={track.pinned ? 'プレイリストから外す' : 'プレイリストに追加'}
        >
          📌
        </button>
      </div>

      {/* シーンタグ行 */}
      <div className="tag-area">
        <span className="tag-area-label">シーン</span>
        {SCENES.map(s => (
          <button
            key={s.id}
            className={`stag${track.scenes.has(s.id) ? ' on' : ''}`}
            onClick={() => toggleScene(track.id, s.id)}
            title={track.scenes.has(s.id) ? `${s.name}から削除` : `${s.name}に追加`}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>
    </div>
  )
}
