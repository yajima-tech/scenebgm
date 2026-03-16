import { useSearchStore } from '../../store/searchStore'

const MOODS = ['わくわく','ムーディー','エレガント','リラックス','高揚','クール','温かみ','ロマンティック']
const INSTS = ['ピアノ','ギター','ストリングス','ブラス','オーケストラ','ボッサノバ','ジャズ']

export function FilterArea() {
  const { bpmMin, bpmMax, durMin, durMax, freeWord, selectedMoods, selectedInsts, setFilter, toggleMood, toggleInst } = useSearchStore()

  return (
    <div className="filter-area">
      {/* ムード */}
      <div className="filter-row">
        <span className="filter-row-label">ムード</span>
        <div className="chips">
          {MOODS.map(m => (
            <button
              key={m}
              className={`chip${selectedMoods.includes(m) ? ' on' : ''}`}
              onClick={() => toggleMood(m)}
            >{m}</button>
          ))}
        </div>
      </div>
      <div className="filter-divider" />

      {/* 楽器 */}
      <div className="filter-row">
        <span className="filter-row-label">楽器</span>
        <div className="chips">
          {INSTS.map(i => (
            <button
              key={i}
              className={`chip inst${selectedInsts.includes(i) ? ' on' : ''}`}
              onClick={() => toggleInst(i)}
            >{i}</button>
          ))}
        </div>
      </div>
      <div className="filter-divider" />

      {/* BPM・尺・フリーワード */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="filter-row-label">BPM</span>
        <input
          className="num-input"
          type="number"
          placeholder="min"
          value={bpmMin}
          onChange={e => setFilter({ bpmMin: e.target.value })}
        />
        <span style={{ color: '#6b6a64' }}>–</span>
        <input
          className="num-input"
          type="number"
          placeholder="max"
          value={bpmMax}
          onChange={e => setFilter({ bpmMax: e.target.value })}
        />

        <span className="filter-row-label" style={{ marginLeft: 12 }}>尺(秒)</span>
        <input
          className="num-input"
          type="number"
          placeholder="min"
          value={durMin}
          onChange={e => setFilter({ durMin: e.target.value })}
        />
        <span style={{ color: '#6b6a64' }}>–</span>
        <input
          className="num-input"
          type="number"
          placeholder="max"
          value={durMax}
          onChange={e => setFilter({ durMax: e.target.value })}
        />
      </div>
      <div className="filter-divider" />

      {/* フリーワード */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="filter-row-label">キーワード</span>
        <input
          className="free-input"
          placeholder="例: classic bright piano"
          value={freeWord}
          onChange={e => setFilter({ freeWord: e.target.value })}
        />
      </div>
    </div>
  )
}
