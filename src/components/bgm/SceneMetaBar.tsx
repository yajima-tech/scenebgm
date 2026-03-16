import type { Scene } from '../../types'

interface Props {
  scene: Scene
}

export function SceneMetaBar({ scene }: Props) {
  return (
    <div
      className="flex items-center gap-6 px-4 py-2.5 rounded-lg mb-4"
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
    >
      <MetaChip label="BPM" value={scene.bpm} />
      <MetaChip label="ムード" value={scene.mood} />
      <MetaChip label="推奨尺" value={scene.dur} />
      <MetaChip label="候補" value={scene.count} />
    </div>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</span>
      <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}
