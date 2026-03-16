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
      className="rounded-lg p-4 transition-all"
      style={{
        background: pinned
          ? 'linear-gradient(135deg, rgba(232,185,106,0.13) 0%, rgba(232,185,106,0.05) 100%)'
          : 'var(--bg2)',
        border: pinned
          ? '1px solid rgba(232,185,106,0.55)'
          : '1px solid var(--border)',
        boxShadow: pinned
          ? '0 0 0 1px rgba(232,185,106,0.2), inset 0 0 24px rgba(232,185,106,0.07)'
          : 'none',
      }}
    >
      {/* Row 1: Play, Name, Duration, Score, Pin, Expand */}
      <div className="flex items-center gap-3 mb-2">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 cursor-pointer"
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border-hi)',
            color: 'var(--text)',
          }}
        >
          ▶
        </button>
        <span className="flex-1 font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>
          {track.name}
        </span>
        <span
          className="text-xs shrink-0"
          style={{ color: 'var(--muted2)', fontFamily: "'DM Mono', monospace" }}
        >
          {track.dur}
        </span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded shrink-0"
          style={{
            background: 'rgba(232,185,106,0.12)',
            color: 'var(--accent)',
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {track.score}%
        </span>
        {/* Pin Button */}
        <button
          onClick={() => togglePin(track.id)}
          className="shrink-0 flex items-center justify-center cursor-pointer"
          style={{
            width: 32,
            height: 32,
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
            width: 32,
            height: 32,
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

      {/* Row 2: Meta */}
      <div className="flex items-center gap-2 mb-2 text-xs pl-11 flex-wrap" style={{ color: 'var(--muted2)' }}>
        {/* Scene badge (pinned view only) */}
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
        <span style={{ color: 'var(--accent)' }}>{track.mood}</span>
        <span style={{ color: 'var(--muted)' }}>/</span>
        {track.tags.map((t) => (
          <span
            key={t}
            className="px-1.5 py-0.5 rounded"
            style={{ background: 'var(--bg3)', color: 'var(--muted2)', fontSize: 11 }}
          >
            {t}
          </span>
        ))}
        <span style={{ color: 'var(--muted)' }}>/</span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            color: bpmChanged ? 'var(--accent)' : undefined,
          }}
        >
          {param.bpm} BPM
        </span>
        {pitchChanged && (
          <>
            <span style={{ color: 'var(--muted)' }}>·</span>
            <span style={{ fontFamily: "'DM Mono', monospace", color: 'var(--accent2)' }}>
              {param.pitch > 0 ? '+' : ''}{param.pitch} st
            </span>
          </>
        )}
      </div>

      {/* Row 3: Waveform */}
      <div className="pl-11">
        <Waveform />
      </div>

      {/* Expandable: BPM & Pitch Controls */}
      {expanded && (
        <div
          className="mt-3 pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <TrackControls trackId={track.id} baseBpm={track.bpm} />
        </div>
      )}
    </div>
  )
}
