import { useSceneStore, SCENES } from '../../store/sceneStore'
import { useSearchStore } from '../../store/searchStore'
import { TrackCard } from '../search/TrackCard'

export function ScenePanel() {
  const { currentSceneId } = useSceneStore()
  const { results } = useSearchStore()
  const scene = SCENES.find(s => s.id === currentSceneId)
  const tagged = results.filter(t => t.scenes.has(currentSceneId))

  return (
    <div style={{ padding: 20 }} className="h-full overflow-y-auto">
      <div className="view-header">
        <span style={{ fontSize: 28 }}>{scene?.icon}</span>
        <div>
          <div className="view-title">{scene?.name}</div>
          <div className="view-sub">タグ付けされた楽曲: {tagged.length}曲</div>
        </div>
      </div>

      {tagged.length === 0 ? (
        <div className="empty-hint">
          <p>「検索」タブで楽曲を検索し、シーンタグボタンで「{scene?.icon} {scene?.name}」を追加してください</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tagged.map(t => <TrackCard key={t.id} track={t} />)}
        </div>
      )}
    </div>
  )
}
