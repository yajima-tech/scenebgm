import { useMemo } from 'react'

export function Waveform({ ratio = 0, count = 38 }: { ratio?: number; count?: number }) {
  const bars = useMemo(() =>
    Array.from({ length: count }, () => 3 + Math.random() * 12), [count])
  return (
    <div className="waveform">
      {bars.map((h, i) => (
        <div
          key={i}
          className={i / count < ratio ? 'bar played' : 'bar unplayed'}
          style={{ height: h }}
        />
      ))}
    </div>
  )
}
