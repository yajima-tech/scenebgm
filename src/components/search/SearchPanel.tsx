import { useSearchStore } from '../../store/searchStore'
import { FilterArea } from './FilterArea'
import { TrackCard } from './TrackCard'

export function SearchPanel() {
  const { results, loading, error, sortMode, setSortMode } = useSearchStore()

  const sorted = [...results]
  if (sortMode === 'bpm') {
    sorted.sort((a, b) => (a.bpm ?? 0) - (b.bpm ?? 0))
  } else if (sortMode === 'dur') {
    sorted.sort((a, b) => a.duration - b.duration)
  }

  return (
    <div style={{ padding: 20 }} className="h-full overflow-y-auto">
      <FilterArea />

      {/* Result Header */}
      <div className="result-header">
        <span className="result-title">検索結果</span>
        <span className="result-count">{results.length}件</span>
        {loading && <span className="result-loading">検索中...</span>}
        <div style={{ flex: 1 }} />
        <div className="sort-bar" style={{ marginBottom: 0 }}>
          <span className="sort-label">並び替え</span>
          {([['rel', '関連度'], ['bpm', 'BPM'], ['dur', '尺']] as const).map(([key, label]) => (
            <button
              key={key}
              className={`sort-btn${sortMode === key ? ' active' : ''}`}
              onClick={() => setSortMode(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-msg">{error}</div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="empty-hint">
          ムード・楽器・キーワードを選択するとFreesoundから楽曲を検索します
        </div>
      )}

      <div className="flex flex-col gap-2">
        {sorted.map(t => <TrackCard key={t.id} track={t} />)}
      </div>
    </div>
  )
}
