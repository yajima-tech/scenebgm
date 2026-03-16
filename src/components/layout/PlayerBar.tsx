import { useAudioPlayer } from '../../store/audioPlayerStore'

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function PlayerBar() {
  const {
    currentTrack, isPlaying, pause, stop,
    currentTime, duration, seek,
    playbackRate, setPlaybackRate,
    detune, setDetune,
  } = useAudioPlayer()

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seek(ratio * duration)
  }

  return (
    <footer className="player">
      {/* 1行目: 既存コントロール */}
      <div className="player-row1">
        <div className="pl-info">
          <span className="pl-name">{currentTrack ? currentTrack.name : '再生中のトラックなし'}</span>
          <span className="pl-sub">{currentTrack ? 'Freesound · CC0' : '—'}</span>
        </div>
        <div className="pl-ctrls">
          <button className="ctrl-skip" style={{ color: 'var(--muted2)', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>⟨⟨</button>
          <button
            onClick={pause}
            className="ctrl-play"
            style={{
              background: currentTrack ? 'var(--accent)' : 'var(--bg3)',
              color: currentTrack ? 'var(--bg)' : 'var(--muted)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? '▐▐' : '▶'}
          </button>
          <button
            onClick={stop}
            className="ctrl-skip"
            style={{ color: 'var(--muted2)', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}
          >⟩⟩</button>
        </div>
        <div className="prog-wrap">
          <span className="prog-time">{formatTime(currentTime)}</span>
          <div className="prog-bar" onClick={handleProgressClick} style={{ cursor: 'pointer' }}>
            <div className="prog-fill" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}>
              <div className="prog-thumb" />
            </div>
          </div>
          <span className="prog-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 2行目: BPM・音程スライダー */}
      {currentTrack && (
        <div className="player-row2">
          <div className="ctrl-group">
            <span className="ctrl-label">BPM</span>
            <input
              type="range" min="0.5" max="2.0" step="0.01"
              value={playbackRate}
              onChange={e => setPlaybackRate(parseFloat(e.target.value))}
              style={{ accentColor: '#e8b96a' }}
            />
            <span className="ctrl-val">{Math.round(playbackRate * 100)}%</span>
            <button className="ctrl-reset" onClick={() => setPlaybackRate(1.0)}>↺</button>
          </div>
          <div className="ctrl-sep" />
          <div className="ctrl-group">
            <span className="ctrl-label">音程</span>
            <input
              type="range" min="-1200" max="1200" step="100"
              value={detune}
              onChange={e => setDetune(parseInt(e.target.value))}
              style={{ accentColor: '#6ad4e8' }}
            />
            <span className="ctrl-val" style={{ color: detune !== 0 ? '#6ad4e8' : undefined }}>
              {detune > 0 ? '+' : ''}{detune / 100} st
            </span>
            <button className="ctrl-reset" onClick={() => setDetune(0)}>↺</button>
          </div>
        </div>
      )}
    </footer>
  )
}
