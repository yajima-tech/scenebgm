import { SE_CATS } from '../../data/seCats'
import { useSEStore, SE_LIVESET_ID } from '../../store/seStore'
import { SEPadGrid } from './SEPadGrid'
import { SEListView } from './SEListView'

export function SEPanel() {
  const { currentCatId, view, setView, pinnedIds } = useSEStore()

  // 本番セット
  if (currentCatId === SE_LIVESET_ID) {
    const allItems = SE_CATS.flatMap((c) => c.items)
    const pinnedItems = allItems.filter((item) => pinnedIds.has(item.id))

    return (
      <div className="p-5 h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🎬</span>
          <div className="flex-1">
            <h2 className="text-lg font-bold" style={{ color: 'var(--live)' }}>本番セット</h2>
            <p className="text-xs" style={{ color: 'var(--muted2)' }}>ピン済みのSE</p>
          </div>
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: 'rgba(224,85,85,0.15)', color: 'var(--live)' }}
          >
            {pinnedItems.length}件
          </span>
          <ViewToggle view={view} setView={setView} />
        </div>
        {pinnedItems.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-lg"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
          >
            <span className="text-3xl mb-3">📌</span>
            <p style={{ color: 'var(--muted2)' }}>各カテゴリの📌を押すとここに追加されます</p>
          </div>
        ) : view === 'pad' ? (
          <SEPadGrid items={pinnedItems} isLive />
        ) : (
          <SEListView items={pinnedItems} isLive />
        )}
      </div>
    )
  }

  const cat = SE_CATS.find((c) => c.id === currentCatId)
  if (!cat) return null

  return (
    <div className="p-5 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{cat.icon}</span>
        <div className="flex-1">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{cat.name}</h2>
          <p className="text-xs" style={{ color: 'var(--muted2)' }}>{cat.sub}</p>
        </div>
        <span
          className="px-2 py-0.5 rounded text-xs font-bold"
          style={{ background: 'rgba(176,106,232,0.15)', color: 'var(--accent3)' }}
        >
          ✦ SE
        </span>
        <ViewToggle view={view} setView={setView} />
      </div>

      {/* Content */}
      {view === 'pad' ? (
        <SEPadGrid items={cat.items} />
      ) : (
        <SEListView items={cat.items} />
      )}
    </div>
  )
}

function ViewToggle({ view, setView }: { view: 'pad' | 'list'; setView: (v: 'pad' | 'list') => void }) {
  return (
    <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-hi)' }}>
      <button
        onClick={() => setView('pad')}
        className="px-3 py-1 text-xs font-medium cursor-pointer"
        style={{
          background: view === 'pad' ? 'var(--accent3)' : 'transparent',
          color: view === 'pad' ? '#0d0f14' : 'var(--muted2)',
          border: 'none',
          transition: 'all 0.15s',
        }}
      >
        パッド
      </button>
      <button
        onClick={() => setView('list')}
        className="px-3 py-1 text-xs font-medium cursor-pointer"
        style={{
          background: view === 'list' ? 'var(--accent3)' : 'transparent',
          color: view === 'list' ? '#0d0f14' : 'var(--muted2)',
          border: 'none',
          borderLeft: '1px solid var(--border-hi)',
          transition: 'all 0.15s',
        }}
      >
        リスト
      </button>
    </div>
  )
}
