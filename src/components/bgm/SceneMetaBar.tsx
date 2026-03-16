import type { Scene } from '../../types'

interface Props {
  scene: Scene
}

export function SceneMetaBar({ scene }: Props) {
  return (
    <div
      className="flex items-center gap-6 rounded-lg mb-4"
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '12px 16px' }}
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
      <span style={{ color: 'var(--muted)', fontSize: 11 }}>{label}</span>
      <span className="font-medium" style={{ color: 'var(--text)', fontSize: 13 }}>{value}</span>
    </div>
  )
}
