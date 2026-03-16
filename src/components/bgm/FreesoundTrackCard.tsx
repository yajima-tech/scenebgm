import type { FreesoundResult } from '../../audio/freesound'
import { useAudioPlayer } from '../../store/audioPlayerStore'
import { Waveform } from '../common/Waveform'

interface Props {
  track: FreesoundResult
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function FreesoundTrackCard({ track }: Props) {
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer()
  const isCurrentTrack = currentTrack?.id === track.id
  const isCurrentPlaying = isCurrentTrack && isPlaying

  const handlePlay = () => {
    if (isCurrentTrack) {
      pause()
    } else {
      play(track)
    }
  }

  return (
    <div
      className="rounded-lg p-4 transition-all"
      style={{
        background: isCurrentPlaying ? 'rgba(232,185,106,0.06)' : 'var(--bg2)',
        border: isCurrentPlaying ? '1px solid rgba(232,185,106,0.3)' : '1px solid var(--border)',
      }}
    >
      {/* Row 1 */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={handlePlay}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 cursor-pointer"
          style={{
            background: isCurrentPlaying ? 'var(--accent)' : 'var(--bg3)',
            border: isCurrentPlaying ? '1px solid var(--accent)' : '1px solid var(--border-hi)',
            color: isCurrentPlaying ? 'var(--bg)' : 'var(--text)',
          }}
        >
          {isCurrentPlaying ? '▐▐' : '▶'}
        </button>
        <span className="flex-1 font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>
          {track.name}
        </span>
        <span
          className="text-xs shrink-0"
          style={{ color: 'var(--muted2)', fontFamily: "'DM Mono', monospace" }}
        >
          {formatDuration(track.duration)}
        </span>
        {track.bpm && (
          <span
            className="text-xs shrink-0"
            style={{ color: 'var(--muted2)', fontFamily: "'DM Mono', monospace" }}
          >
            {Math.round(track.bpm)} BPM
          </span>
        )}
        <span
          className="px-1.5 py-0.5 rounded text-xs shrink-0"
          style={{ background: 'rgba(106,212,232,0.12)', color: 'var(--accent2)', fontSize: 10 }}
        >
          CC0
        </span>
      </div>

      {/* Row 2: Tags */}
      <div className="flex items-center gap-1.5 mb-2 pl-11 flex-wrap">
        {track.tags.slice(0, 5).map((t) => (
          <span
            key={t}
            className="px-1.5 py-0.5 rounded"
            style={{ background: 'var(--bg3)', color: 'var(--muted2)', fontSize: 10 }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Row 3: Waveform */}
      <div className="pl-11">
        <Waveform ratio={isCurrentTrack ? (useAudioPlayer.getState().currentTime / (useAudioPlayer.getState().duration || 1)) : 0} />
      </div>
    </div>
  )
}
