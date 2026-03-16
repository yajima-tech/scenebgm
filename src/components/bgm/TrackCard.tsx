import { useState } from 'react'
import type { Track } from '../../types'
import { useBGMStore } from '../../store/bgmStore'
import { Waveform } from '../common/Waveform'
import { TrackControls } from './TrackControls'

interface Props {
  track: Track
  isPinnedView?: boolean
  sceneName?: string
  sceneIcon?: string
}

export function TrackCard({ track, isPinnedView, sceneName, sceneIcon }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { pinnedIds, togglePin, getParam } = useBGMStore()
  const pinned = pinnedIds.has(track.id)
  const param = getParam(track.id, track.bpm)
  const bpmChanged = param.bpm !== track.bpm
  const pitchChanged = param.pitch !== 0

  return (
    <div
      style={{
        background: pinned
          ? 'linear-gradient(135deg, rgba(232,185,106,0.13) 0%, rgba(232,185,106,0.05) 100%)'
          : '#13161e',
        border: pinned
          ? '1px solid rgba(232,185,106,0.55)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: pinned
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
        className="rounded-full flex items-center justify-center shrink-0 cursor-pointer"
        style={{
          width: 40,
          height: 40,
          background: 'var(--bg3)',
          border: '1px solid var(--border-hi)',
          color: 'var(--text)',
          fontSize: 14,
        }}
      >
        ▶
      </button>

      {/* Center content */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="font-semibold truncate" style={{ color: 'var(--text)', fontSize: 15 }}>
          {track.name}
        </span>
        <div className="flex items-center gap-2 flex-wrap" style={{ color: 'var(--muted2)' }}>
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
          <span style={{ color: 'var(--accent)', fontSize: 11 }}>{track.mood}</span>
          <span style={{ color: 'var(--muted)', fontSize: 11 }}>/</span>
          {track.tags.map((t) => (
            <span
              key={t}
              className="rounded"
              style={{ background: 'var(--bg3)', color: 'var(--muted2)', fontSize: 11, padding: '3px 8px' }}
            >
              {t}
            </span>
          ))}
          <span style={{ color: 'var(--muted)', fontSize: 11 }}>/</span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              color: bpmChanged ? 'var(--accent)' : 'var(--muted2)',
              fontSize: 11,
            }}
          >
            {param.bpm} BPM
          </span>
          {pitchChanged && (
            <>
              <span style={{ color: 'var(--muted)', fontSize: 11 }}>·</span>
              <span style={{ fontFamily: "'DM Mono', monospace", color: 'var(--accent2)', fontSize: 11 }}>
                {param.pitch > 0 ? '+' : ''}{param.pitch} st
              </span>
            </>
          )}
        </div>
        <Waveform />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <span
          className="shrink-0"
          style={{ color: 'var(--muted2)', fontFamily: "'DM Mono', monospace", fontSize: 12 }}
        >
          {track.dur}
        </span>
        <span
          className="font-bold rounded shrink-0"
          style={{
            background: 'rgba(232,185,106,0.12)',
            color: 'var(--accent)',
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            padding: '3px 8px',
          }}
        >
          {track.score}%
        </span>
        {/* Pin Button */}
        <button
          onClick={() => togglePin(track.id)}
          className="shrink-0 flex items-center justify-center cursor-pointer"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: pinned ? '1px solid #e8b96a' : '1px solid var(--border-hi)',
            background: pinned ? '#e8b96a' : 'var(--bg3)',
            color: pinned ? '#0d0f14' : 'var(--muted)',
            boxShadow: pinned
              ? '0 0 8px rgba(232,185,106,0.6), 0 0 20px rgba(232,185,106,0.25)'
              : 'none',
            transition: 'all 0.2s',
            fontSize: 14,
          }}
        >
          📌
        </button>
        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 flex items-center justify-center cursor-pointer"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: '1px solid var(--border-hi)',
            background: expanded ? 'rgba(106,212,232,0.12)' : 'var(--bg3)',
            color: expanded ? 'var(--accent2)' : 'var(--muted)',
            transition: 'all 0.2s',
            fontSize: 14,
          }}
        >
          ♩
        </button>
      </div>

      {/* Expandable: BPM & Pitch Controls */}
      {expanded && (
        <div
          style={{ borderTop: '1px solid var(--border)', gridColumn: '1 / -1', paddingTop: 12, marginTop: 4 }}
        >
          <TrackControls trackId={track.id} baseBpm={track.bpm} />
        </div>
      )}
    </div>
  )
}
