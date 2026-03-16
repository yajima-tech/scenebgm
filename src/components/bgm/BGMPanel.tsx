import { useState, useEffect } from 'react'
import { SCENES } from '../../data/scenes'
import { useBGMStore, BGM_LIVESET_ID } from '../../store/bgmStore'
import { usePlaylistStore } from '../../store/playlistStore'
import { searchBGM } from '../../audio/freesound'
import type { FreesoundResult } from '../../audio/freesound'
import { SCENE_QUERY_MAP } from '../../audio/sceneQueryMap'
import { SceneMetaBar } from './SceneMetaBar'
import { FreesoundTrackCard } from './FreesoundTrackCard'
import { FilterArea, MOOD_EN, INST_EN } from './FilterArea'

const PLAYLIST_PREFIX = '__playlist__'

type SortKey = 'match' | 'bpm' | 'duration'

export function BGMPanel() {
  const currentSceneId = useBGMStore((s) => s.currentSceneId)
  const scene = SCENES.find((s) => s.id === currentSceneId)

  const { playlists, activePlaylistId } = usePlaylistStore()

  const [freesoundTracks, setFreesoundTracks] = useState<FreesoundResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [selectedInsts, setSelectedInsts] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('match')

  // Auto-search on scene change
  useEffect(() => {
    if (currentSceneId === BGM_LIVESET_ID || currentSceneId.startsWith(PLAYLIST_PREFIX)) return
    const sceneConfig = SCENE_QUERY_MAP[currentSceneId]
    if (!sceneConfig) return
    runSearch(sceneConfig.queries)
  }, [currentSceneId])

  async function runSearch(queries: string[]) {
    setLoading(true)
    setError(null)
    setFreesoundTracks([])
    try {
      const allResults: FreesoundResult[] = []
      const seenIds = new Set<number>()
      for (const q of queries) {
        const results = await searchBGM(q)
        for (const r of results) {
          if (!seenIds.has(r.id)) {
            seenIds.add(r.id)
            allResults.push(r)
          }
        }
        if (allResults.length >= 10) break
      }
      let filtered = allResults.slice(0, 10)
      if (currentSceneId === 'nyuure') {
        filtered = filtered.filter(r => r.bpm == null || (r.bpm >= 78 && r.bpm <= 115))
      }
      setFreesoundTracks(filtered)
    } catch (e: unknown) {
      console.error('Freesound APIエラー:', e)
      setError(`エラー: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  function handleFilterSearch(query: string) {
    if (!query.trim()) return
    runSearch([query])
  }

  function sortTracks(tracks: FreesoundResult[]): FreesoundResult[] {
    const sorted = [...tracks]
    if (sortKey === 'bpm') {
      sorted.sort((a, b) => (a.bpm ?? 0) - (b.bpm ?? 0))
    } else if (sortKey === 'duration') {
      sorted.sort((a, b) => a.duration - b.duration)
    } else {
      // match: score by how many selected mood/inst tags match
      const moodTerms = selectedMoods.map(m => MOOD_EN[m]?.toLowerCase() ?? '')
      const instTerms = selectedInsts.map(i => INST_EN[i]?.toLowerCase() ?? '')
      const allTerms = [...moodTerms, ...instTerms].filter(Boolean)
      if (allTerms.length === 0) return sorted
      sorted.sort((a, b) => {
        const aScore = allTerms.filter(t => a.tags.some(tag => tag.toLowerCase().includes(t.split(' ')[0]))).length
        const bScore = allTerms.filter(t => b.tags.some(tag => tag.toLowerCase().includes(t.split(' ')[0]))).length
        return bScore - aScore
      })
    }
    return sorted
  }

  // Playlist view
  if (currentSceneId.startsWith(PLAYLIST_PREFIX)) {
    const plId = currentSceneId.slice(PLAYLIST_PREFIX.length)
    const pl = playlists.find(p => p.id === plId)
    if (!pl) return null
    return (
      <div style={{ padding: 20 }} className="h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🎵</span>
          <div>
            <h2 className="font-bold" style={{ color: 'var(--accent)', fontSize: 22 }}>{pl.name}</h2>
            <p style={{ color: 'var(--muted2)', fontSize: 14 }}>プレイリスト</p>
          </div>
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: 'rgba(232,185,106,0.15)', color: 'var(--accent)' }}
          >
            {pl.tracks.length}曲
          </span>
        </div>
        {pl.tracks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-lg"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
          >
            <span className="text-3xl mb-3">🎵</span>
            <p style={{ color: 'var(--muted2)' }}>各シーンの📌を押すとここに追加されます</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pl.tracks.map((t) => (
              <FreesoundTrackCard
                key={t.id}
                track={t}
                isPinnedView
                sceneName={t.sceneName}
                sceneIcon={t.sceneIcon}
                playlistId={plId}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Legacy liveset redirect (for compatibility)
  if (currentSceneId === BGM_LIVESET_ID) {
    const pl = playlists[0]
    if (!pl) return null
    return (
      <div style={{ padding: 20 }} className="h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🎵</span>
          <div>
            <h2 className="font-bold" style={{ color: 'var(--accent)', fontSize: 22 }}>{pl.name}</h2>
            <p style={{ color: 'var(--muted2)', fontSize: 14 }}>プレイリスト</p>
          </div>
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: 'rgba(232,185,106,0.15)', color: 'var(--accent)' }}
          >
            {pl.tracks.length}曲
          </span>
        </div>
        {pl.tracks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-lg"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
          >
            <span className="text-3xl mb-3">🎵</span>
            <p style={{ color: 'var(--muted2)' }}>各シーンの📌を押すとここに追加されます</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pl.tracks.map((t) => (
              <FreesoundTrackCard
                key={t.id}
                track={t}
                isPinnedView
                sceneName={t.sceneName}
                sceneIcon={t.sceneIcon}
                playlistId={pl.id}
              />
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

  const displayTracks = sortTracks(freesoundTracks)

  return (
    <div style={{ padding: 20, background: '#0d0f14' }} className="h-full overflow-y-auto">
      {/* Main Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{scene.icon}</span>
        <div className="flex-1">
          <h2 className="font-bold" style={{ color: 'var(--text)', fontSize: 22 }}>{scene.name}</h2>
          <p style={{ color: 'var(--muted2)', fontSize: 14 }}>{scene.sub}</p>
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

      {/* Filter Area */}
      <FilterArea
        onSearch={handleFilterSearch}
        selectedMoods={selectedMoods}
        selectedInsts={selectedInsts}
        onMoodsChange={setSelectedMoods}
        onInstsChange={setSelectedInsts}
      />

      {/* Sort Bar */}
      <div className="sort-bar">
        <span className="sort-label">並び替え</span>
        {([['match', 'マッチ度'], ['bpm', 'BPM'], ['duration', '尺']] as [SortKey, string][]).map(([key, label]) => (
          <button
            key={key}
            className={`sort-btn${sortKey === key ? ' active' : ''}`}
            onClick={() => setSortKey(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Freesound Tracks */}
      {loading && (
        <div className="flex items-center justify-center py-12">
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
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>該当する楽曲が見つかりませんでした</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {displayTracks.map((ft) => (
          <FreesoundTrackCard key={ft.id} track={ft} sceneName={scene.name} sceneIcon={scene.icon} />
        ))}
      </div>
    </div>
  )
}

export { PLAYLIST_PREFIX }
