import { useState, useEffect } from 'react'
import { SCENES } from '../../data/scenes'
import { useBGMStore, BGM_LIVESET_ID } from '../../store/bgmStore'
import { searchBGM } from '../../audio/freesound'
import type { FreesoundResult } from '../../audio/freesound'
import { SCENE_QUERY_MAP } from '../../audio/sceneQueryMap'
import { SceneMetaBar } from './SceneMetaBar'
import { TrackCard } from './TrackCard'
import { FreesoundTrackCard } from './FreesoundTrackCard'

export function BGMPanel() {
  const currentSceneId = useBGMStore((s) => s.currentSceneId)
  const getPinnedTracks = useBGMStore((s) => s.getPinnedTracks)
  const scene = SCENES.find((s) => s.id === currentSceneId)

  const [freesoundTracks, setFreesoundTracks] = useState<FreesoundResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentSceneId === BGM_LIVESET_ID) return
    console.log('APIキー確認:', import.meta.env.VITE_FREESOUND_API_KEY ? '読み込み済み' : '未設定')
    const sceneQuery = SCENE_QUERY_MAP[currentSceneId]
    if (!sceneQuery) return
    setLoading(true)
    setError(null)
    setFreesoundTracks([])
    searchBGM(sceneQuery.query, sceneQuery.bpmMin, sceneQuery.bpmMax)
      .then(setFreesoundTracks)
      .catch((e) => {
        console.error('Freesound APIエラー:', e)
        setError(`エラー: ${e.message}`)
      })
      .finally(() => setLoading(false))
  }, [currentSceneId])

  // 本番セット
  if (currentSceneId === BGM_LIVESET_ID) {
    const pinned = getPinnedTracks()
    return (
      <div className="p-5 h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🎬</span>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--live)' }}>本番セット</h2>
            <p className="text-xs" style={{ color: 'var(--muted2)' }}>ピン済みのBGMトラック</p>
          </div>
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: 'rgba(224,85,85,0.15)', color: 'var(--live)' }}
          >
            {pinned.length}曲
          </span>
        </div>
        {pinned.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-lg"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
          >
            <span className="text-3xl mb-3">📌</span>
            <p style={{ color: 'var(--muted2)' }}>各シーンの📌を押すとここに追加されます</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pinned.map((t) => (
              <TrackCard key={t.id} track={t} isPinnedView sceneName={t.sceneName} sceneIcon={t.sceneIcon} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--muted)' }}>
        <p>シーンを選択してください</p>
      </div>
    )
  }

  return (
    <div className="p-5 h-full overflow-y-auto">
      {/* Main Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{scene.icon}</span>
        <div className="flex-1">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{scene.name}</h2>
          <p className="text-xs" style={{ color: 'var(--muted2)' }}>{scene.sub}</p>
        </div>
        <span
          className="px-2 py-0.5 rounded text-xs font-bold"
          style={{ background: 'rgba(232,185,106,0.12)', color: 'var(--accent)' }}
        >
          ✦ BGM
        </span>
      </div>

      {/* Scene Meta Bar */}
      <SceneMetaBar scene={scene} />

      {/* Track List (dummy data) */}
      <div className="flex flex-col gap-3">
        {scene.tracks.map((t) => (
          <TrackCard key={t.id} track={t} />
        ))}
      </div>

      {/* Freesound Section */}
      <div className="flex items-center gap-3 mt-6 mb-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--muted2)' }}>Freesound より</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <span className="text-sm" style={{ color: 'var(--muted2)' }}>検索中...</span>
        </div>
      )}

      {error && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg mb-3"
          style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)' }}
        >
          <span className="text-sm" style={{ color: 'var(--live)' }}>{error}</span>
        </div>
      )}

      {!loading && !error && freesoundTracks.length === 0 && (
        <div className="text-center py-6">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>CC0楽曲が見つかりませんでした</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {freesoundTracks.map((ft) => (
          <FreesoundTrackCard key={ft.id} track={ft} />
        ))}
      </div>
    </div>
  )
}
