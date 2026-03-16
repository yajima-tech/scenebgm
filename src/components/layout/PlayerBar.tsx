import { useAudioPlayer } from '../../store/audioPlayerStore'

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function PlayerBar() {
  const { currentTrack, isPlaying, pause, stop, currentTime, duration } = useAudioPlayer()
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <footer
      className="flex items-center px-5 gap-6"
      style={{
        gridColumn: '1 / -1',
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        height: 80,
      }}
    >
      {/* Left: Track info */}
      <div className="flex flex-col gap-0.5 min-w-[140px]">
        <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
          {currentTrack ? currentTrack.name : '再生中のトラックなし'}
        </span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {currentTrack ? 'Freesound · CC0' : '—'}
        </span>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-3">
        <button
          className="text-lg cursor-pointer"
          style={{ color: 'var(--muted2)', background: 'none', border: 'none' }}
        >
          ⟨⟨
        </button>
        <button
          onClick={pause}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer"
          style={{
            background: currentTrack ? 'var(--accent)' : 'var(--bg3)',
            color: currentTrack ? 'var(--bg)' : 'var(--muted)',
            border: 'none',
          }}
        >
          {isPlaying ? '▐▐' : '▶'}
        </button>
        <button
          onClick={stop}
          className="text-lg cursor-pointer"
          style={{ color: 'var(--muted2)', background: 'none', border: 'none' }}
        >
          ⟩⟩
        </button>
      </div>

      {/* Center-right: Progress */}
      <div className="flex items-center gap-2 flex-1">
        <span
          className="text-xs"
          style={{ color: 'var(--muted)', fontFamily: "'DM Mono', monospace", minWidth: 32, textAlign: 'right' }}
        >
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--bg3)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'var(--accent)' }}
          />
        </div>
        <span
          className="text-xs"
          style={{ color: 'var(--muted)', fontFamily: "'DM Mono', monospace", minWidth: 32 }}
        >
          {formatTime(duration)}
        </span>
      </div>

      {/* Right: Volume + add */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm" style={{ color: 'var(--muted2)' }}>🔊</span>
          <div className="w-16 h-1 rounded-full" style={{ background: 'var(--bg3)' }}>
            <div className="h-full rounded-full w-3/4" style={{ background: 'var(--muted2)' }} />
          </div>
        </div>
        <button
          className="px-3 py-1 rounded-md text-xs font-medium cursor-pointer"
          style={{
            border: '1px solid var(--border-hi)',
            color: 'var(--muted2)',
            background: 'transparent',
          }}
        >
          + リストに追加
        </button>
      </div>
    </footer>
  )
}
