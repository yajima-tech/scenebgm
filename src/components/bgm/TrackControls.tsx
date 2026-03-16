import { useBGMStore } from '../../store/bgmStore'

interface Props {
  trackId: string
  baseBpm: number
}

export function TrackControls({ trackId, baseBpm }: Props) {
  const { getParam, setTrackParam, resetTrackParam } = useBGMStore()
  const param = getParam(trackId, baseBpm)
  const bpmChanged = param.bpm !== baseBpm
  const pitchChanged = param.pitch !== 0

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* BPM */}
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <span className="text-xs font-medium" style={{ color: 'var(--muted2)', width: 32 }}>BPM</span>
        <input
          type="range"
          min={50}
          max={200}
          step={1}
          value={param.bpm}
          onChange={(e) => setTrackParam(trackId, baseBpm, { bpm: Number(e.target.value) })}
          className="flex-1 h-1 cursor-pointer"
          style={{
            accentColor: bpmChanged ? 'var(--accent)' : 'var(--muted2)',
          }}
        />
        <span
          className="text-xs font-bold w-8 text-right"
          style={{
            fontFamily: "'DM Mono', monospace",
            color: bpmChanged ? 'var(--accent)' : 'var(--text)',
          }}
        >
          {param.bpm}
        </span>
        <button
          onClick={() => resetTrackParam(trackId, baseBpm, 'bpm')}
          className="text-xs cursor-pointer"
          style={{
            background: 'none',
            border: 'none',
            color: bpmChanged ? 'var(--accent)' : 'var(--muted)',
            opacity: bpmChanged ? 1 : 0.4,
          }}
        >
          ↺
        </button>
      </div>

      <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

      {/* Pitch */}
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <span className="text-xs font-medium" style={{ color: 'var(--muted2)', width: 32 }}>音程</span>
        <input
          type="range"
          min={-12}
          max={12}
          step={1}
          value={param.pitch}
          onChange={(e) => setTrackParam(trackId, baseBpm, { pitch: Number(e.target.value) })}
          className="flex-1 h-1 cursor-pointer"
          style={{
            accentColor: pitchChanged ? 'var(--accent2)' : 'var(--muted2)',
          }}
        />
        <span
          className="text-xs font-bold w-10 text-right"
          style={{
            fontFamily: "'DM Mono', monospace",
            color: pitchChanged ? 'var(--accent2)' : 'var(--text)',
          }}
        >
          {param.pitch > 0 ? '+' : ''}{param.pitch} st
        </span>
        <button
          onClick={() => resetTrackParam(trackId, baseBpm, 'pitch')}
          className="text-xs cursor-pointer"
          style={{
            background: 'none',
            border: 'none',
            color: pitchChanged ? 'var(--accent2)' : 'var(--muted)',
            opacity: pitchChanged ? 1 : 0.4,
          }}
        >
          ↺
        </button>
      </div>
    </div>
  )
}
