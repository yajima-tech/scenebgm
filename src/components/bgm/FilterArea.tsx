import { useState } from 'react'

const MOODS = ['わくわく','ムーディー','エレガント','リラックス','高揚','クール','温かみ','ロマンティック']
const INSTS  = ['ピアノ','ギター','ストリングス','ブラス','オーケストラ','ボッサノバ','ジャズ']

const MOOD_EN: Record<string,string> = {
  'わくわく':'uplifting excited', 'ムーディー':'moody atmospheric',
  'エレガント':'elegant refined', 'リラックス':'relaxing calm',
  '高揚':'euphoric', 'クール':'cool smooth',
  '温かみ':'warm cozy', 'ロマンティック':'romantic',
}
const INST_EN: Record<string,string> = {
  'ピアノ':'piano', 'ギター':'guitar acoustic',
  'ストリングス':'strings', 'ブラス':'brass',
  'オーケストラ':'orchestra', 'ボッサノバ':'bossa nova', 'ジャズ':'jazz',
}

interface Props {
  onSearch: (query: string) => void
  selectedMoods: string[]
  selectedInsts: string[]
  onMoodsChange: (m: string[]) => void
  onInstsChange: (i: string[]) => void
}

export function FilterArea({ onSearch, selectedMoods, selectedInsts, onMoodsChange, onInstsChange }: Props) {
  const [freeWord, setFreeWord] = useState('')

  function toggleMood(m: string) {
    onMoodsChange(
      selectedMoods.includes(m) ? selectedMoods.filter(x=>x!==m) : [...selectedMoods, m]
    )
  }
  function toggleInst(i: string) {
    onInstsChange(
      selectedInsts.includes(i) ? selectedInsts.filter(x=>x!==i) : [...selectedInsts, i]
    )
  }

  const query = [
    ...selectedMoods.map(m => MOOD_EN[m]),
    ...selectedInsts.map(i => INST_EN[i]),
    freeWord,
  ].filter(Boolean).join(' ')

  return (
    <div className="filter-area">
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
      <div className="search-row">
        <input
          className="free-input"
          placeholder="フリーワード（例: classic bright）"
          value={freeWord}
          onChange={e => setFreeWord(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSearch(query) }}
        />
        <button className="search-btn" onClick={() => onSearch(query)}>
          Freesoundで検索
        </button>
      </div>
      <div className="query-row">
        <span className="query-label">検索クエリ</span>
        <span className="query-text">{query || '（未選択）'}</span>
      </div>
    </div>
  )
}

export { MOOD_EN, INST_EN }
