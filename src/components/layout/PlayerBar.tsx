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
      className="flex items-center"
      style={{
        gridColumn: '1 / -1',
        background: '#13161e',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        height: 70,
        padding: '0 24px',
        gap: 16,
      }}
    >
      {/* Left: Track info */}
      <div className="flex flex-col gap-0.5 min-w-[140px]">
        <span className="font-medium truncate" style={{ color: 'var(--text)', fontSize: 14 }}>
          {currentTrack ? currentTrack.name : '再生中のトラックなし'}
        </span>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>
          {currentTrack ? 'Freesound · CC0' : '—'}
        </span>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-3">
        <button
          className="cursor-pointer"
          style={{ color: 'var(--muted2)', background: 'none', border: 'none', fontSize: 16 }}
        >
          ⟨⟨
        </button>
        <button
          onClick={pause}
          className="rounded-full flex items-center justify-center cursor-pointer"
          style={{
            width: 38,
            height: 38,
            background: currentTrack ? 'var(--accent)' : 'var(--bg3)',
            color: currentTrack ? 'var(--bg)' : 'var(--muted)',
            border: 'none',
            fontSize: 16,
          }}
        >
          {isPlaying ? '▐▐' : '▶'}
        </button>
        <button
          onClick={stop}
          className="cursor-pointer"
          style={{ color: 'var(--muted2)', background: 'none', border: 'none', fontSize: 16 }}
        >
          ⟩⟩
        </button>
      </div>

      {/* Center-right: Progress */}
      <div className="flex items-center gap-2 flex-1">
        <span
          style={{ color: 'var(--muted)', fontFamily: "'DM Mono', monospace", minWidth: 32, textAlign: 'right', fontSize: 12 }}
        >
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 rounded-full" style={{ background: 'var(--bg3)', height: 4 }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'var(--accent)' }}
          />
        </div>
        <span
          style={{ color: 'var(--muted)', fontFamily: "'DM Mono', monospace", minWidth: 32, fontSize: 12 }}
        >
          {formatTime(duration)}
        </span>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center gap-1.5">
        <span style={{ color: 'var(--muted2)', fontSize: 14 }}>🔊</span>
        <div className="w-16 rounded-full" style={{ background: 'var(--bg3)', height: 4 }}>
          <div className="h-full rounded-full w-3/4" style={{ background: 'var(--muted2)' }} />
        </div>
      </div>
    </footer>
  )
}
