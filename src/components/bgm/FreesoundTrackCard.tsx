import type { FreesoundResult } from '../../audio/freesound'
import { useAudioPlayer } from '../../store/audioPlayerStore'
import { usePlaylistStore } from '../../store/playlistStore'
import { Waveform } from '../common/Waveform'

interface Props {
  track: FreesoundResult
  sceneName?: string
  sceneIcon?: string
  isPinnedView?: boolean
  playlistId?: string
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function FreesoundTrackCard({ track, sceneName, sceneIcon, isPinnedView, playlistId }: Props) {
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer()
  const { activePlaylistId, addTrack, removeTrack, hasTrack } = usePlaylistStore()
  const isCurrentTrack = currentTrack?.id === track.id
  const isCurrentPlaying = isCurrentTrack && isPlaying

  const effectivePlaylistId = playlistId ?? activePlaylistId
  const inPlaylist = hasTrack(effectivePlaylistId, String(track.id))

  const handlePlay = () => {
    if (isCurrentTrack) {
      pause()
    } else {
      play(track)
    }
  }

  const handlePin = () => {
    if (inPlaylist) {
      removeTrack(effectivePlaylistId, String(track.id))
    } else {
      addTrack(effectivePlaylistId, track, sceneName ?? '', sceneIcon ?? '')
    }
  }

  return (
    <div
      style={{
        background: inPlaylist
          ? 'linear-gradient(135deg, rgba(232,185,106,0.13) 0%, rgba(232,185,106,0.05) 100%)'
          : isCurrentPlaying ? 'rgba(232,185,106,0.06)' : '#13161e',
        border: inPlaylist
          ? '1px solid rgba(232,185,106,0.55)'
          : isCurrentPlaying ? '1px solid rgba(232,185,106,0.3)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: inPlaylist
          ? '0 0 0 1px rgba(232,185,106,0.2), inset 0 0 24px rgba(232,185,106,0.07)'
          : 'none',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 10,
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {/* Play button */}
      <button
        onClick={handlePlay}
        className="rounded-full flex items-center justify-center shrink-0 cursor-pointer"
        style={{
          width: 40,
          height: 40,
          background: isCurrentPlaying ? 'var(--accent)' : 'var(--bg3)',
          border: isCurrentPlaying ? '1px solid var(--accent)' : '1px solid var(--border-hi)',
          color: isCurrentPlaying ? 'var(--bg)' : 'var(--text)',
          fontSize: 14,
        }}
      >
        {isCurrentPlaying ? '▐▐' : '▶'}
      </button>

      {/* Center content */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="font-semibold truncate" style={{ color: 'var(--text)', fontSize: 15 }}>
          {track.name}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {isPinnedView && sceneName && (
            <span
              style={{
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 99,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--muted2)',
              }}
            >
              {sceneIcon} {sceneName}
            </span>
          )}
          {track.tags.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded"
              style={{ background: 'var(--bg3)', color: 'var(--muted2)', fontSize: 11, padding: '3px 8px' }}
            >
              {t}
            </span>
          ))}
        </div>
        <Waveform ratio={isCurrentTrack ? (useAudioPlayer.getState().currentTime / (useAudioPlayer.getState().duration || 1)) : 0} />
      </div>

      {/* Right info */}
      <div className="flex items-center gap-2">
        <span
          className="shrink-0"
          style={{ color: 'var(--muted2)', fontFamily: "'DM Mono', monospace", fontSize: 12 }}
        >
          {formatDuration(track.duration)}
        </span>
        {track.bpm && (
          <span
            className="shrink-0"
            style={{ color: 'var(--muted2)', fontFamily: "'DM Mono', monospace", fontSize: 11 }}
          >
            {Math.round(track.bpm)} BPM
          </span>
        )}
        <span
          className="rounded shrink-0"
          style={{ background: 'rgba(106,212,232,0.12)', color: 'var(--accent2)', fontSize: 11, padding: '3px 8px' }}
        >
          CC0
        </span>
        {/* Pin / Remove Button */}
        <button
          onClick={handlePin}
          title={isPinnedView ? 'プレイリストから削除' : 'プレイリストに追加'}
          className="shrink-0 flex items-center justify-center cursor-pointer"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: isPinnedView
              ? '1px solid var(--live)'
              : inPlaylist ? '1px solid #e8b96a' : '1px solid var(--border-hi)',
            background: isPinnedView
              ? 'rgba(224,85,85,0.15)'
              : inPlaylist ? '#e8b96a' : 'var(--bg3)',
            color: isPinnedView
              ? 'var(--live)'
              : inPlaylist ? '#0d0f14' : 'var(--muted)',
            boxShadow: !isPinnedView && inPlaylist
              ? '0 0 8px rgba(232,185,106,0.6), 0 0 20px rgba(232,185,106,0.25)'
              : 'none',
            transition: 'all 0.2s',
            fontSize: isPinnedView ? 16 : 14,
            fontWeight: isPinnedView ? 700 : 400,
          }}
        >
          {isPinnedView ? '−' : '📌'}
        </button>
      </div>
    </div>
  )
}
