import { useAiGenStore } from '../../store/aiGenStore'
import { useSearchStore } from '../../store/searchStore'
import { useAudioPlayer } from '../../store/audioPlayerStore'
import { SCENES } from '../../store/sceneStore'
import type { FreesoundResult } from '../../audio/freesound'
import { useState } from 'react'

const GENRE_OPTIONS = ['ジャズ','クラシカル','オーケストラ','アンビエント','ポップ','エレクトロ','ボッサノバ','ファンク']
const TEMPO_OPTIONS = ['ゆっくり (60-80)','普通 (80-110)','速め (110-140)','速い (140+)']
const DUR_OPTIONS   = ['30秒','1分','2分','3分']
const VAR_OPTIONS   = [1, 3, 5]
const VAR_LABELS    = ['A','B','C','D','E']

const EXAMPLE_PROMPTS = [
  '🚪 賑やかで期待感のある客入れBGM',
  '🏆 壮大で感動的なアワード授与の音楽',
  '🥂 明るく華やかな乾杯ファンファーレ',
  '🍻 軽快でおしゃれな歓談BGM',
]

export function AiGenPanel() {
  const {
    prompt, genre, tempo, duration, varCount,
    status, statusMessage, error,
    geminiResult, results, selectedIndex,
    setPrompt, setGenre, setTempo, setDuration, setVarCount,
    setSelectedIndex, generate, reset
  } = useAiGenStore()

  const { toggleScene, togglePin } = useSearchStore()
  const { play: audioPlay } = useAudioPlayer()

  const [sceneTags, setSceneTags] = useState<Record<number, Set<string>>>({})

  function handleToggleScene(trackId: number, sceneId: string) {
    setSceneTags(prev => {
      const next = { ...prev }
      if (!next[trackId]) next[trackId] = new Set()
      else next[trackId] = new Set(next[trackId])
      next[trackId].has(sceneId) ? next[trackId].delete(sceneId) : next[trackId].add(sceneId)
      return next
    })
    toggleScene(trackId, sceneId)
  }

  const currentTrack: FreesoundResult | undefined = results[selectedIndex]
  const isLoading = status === 'thinking' || status === 'searching'

  return (
    <div className="aigen-panel">
      {/* ヒーロー */}
      <div className="aigen-hero">
        <div className="aigen-title">✦ AI BGM ジェネレーター</div>
        <div className="aigen-sub">イメージをテキストで伝えるだけで、シーンに合ったBGMをAIが提案します</div>
      </div>

      {/* 入力エリア */}
      <div className="aigen-input-area">
        <div className="input-label" style={{ fontSize: 13, fontWeight: 600, color: '#e8e6df' }}>どんなBGMを作りますか？</div>
        <textarea
          className="prompt-input"
          placeholder="例：落ち着いたジャズピアノ、秋の夕暮れのような雰囲気で、登壇シーンに合う格調ある感じ"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
        />
        {/* 例文チップ */}
        <div className="example-row">
          {EXAMPLE_PROMPTS.map(ex => (
            <button key={ex} className="ex-chip" onClick={() => setPrompt(ex.replace(/^[^ ]+ /, ''))}>
              {ex}
            </button>
          ))}
        </div>
        {/* パラメータ */}
        <div className="params-row">
          <div className="param-group">
            <div className="param-label">ジャンル</div>
            <select className="param-select" value={genre} onChange={e => setGenre(e.target.value)}>
              {GENRE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="param-group">
            <div className="param-label">テンポ</div>
            <select className="param-select" value={tempo} onChange={e => setTempo(e.target.value)}>
              {TEMPO_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="param-group">
            <div className="param-label">尺</div>
            <select className="param-select" value={duration} onChange={e => setDuration(e.target.value)}>
              {DUR_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="param-group">
            <div className="param-label">提案数</div>
            <select className="param-select" value={varCount} onChange={e => setVarCount(Number(e.target.value))}>
              {VAR_OPTIONS.map(o => <option key={o} value={o}>{o}曲</option>)}
            </select>
          </div>
        </div>
        {/* 生成ボタン */}
        <div className="gen-row">
          <button
            className={`gen-btn${isLoading ? ' loading' : ''}`}
            onClick={generate}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? '生成中...' : status === 'done' ? '✦ 再提案する' : '✦ BGMを探す'}
          </button>
          <div className="gen-hint">
            Gemini APIでクエリを生成してFreesoundから最適なCC0楽曲を提案します。
          </div>
        </div>
        {/* Geminiが生成したクエリを表示 */}
        {geminiResult && (
          <div className="query-row" style={{ marginTop: 8 }}>
            <span className="q-label">AIクエリ</span>
            <span className="q-text">{geminiResult.queries.join(' / ')}</span>
          </div>
        )}
      </div>

      {/* ローディング */}
      {isLoading && (
        <div className="gen-loading">
          <div className="loading-bars">
            {Array.from({ length: 7 }).map((_, i) => <div key={i} className="lbar" />)}
          </div>
          <div className="loading-text">{statusMessage}</div>
          <div className="loading-sub">しばらくお待ちください</div>
        </div>
      )}

      {/* エラー */}
      {status === 'error' && (
        <div className="error-msg">
          エラーが発生しました: {error}
          <button onClick={reset} style={{ marginLeft: 12, cursor: 'pointer' }}>再試行</button>
        </div>
      )}

      {/* 結果 */}
      {status === 'done' && results.length > 0 && (
        <div className="result-area">
          <div className="result-header">
            <span className="result-title">提案楽曲</span>
            <span className="result-count">{results.length}件</span>
            {geminiResult && (
              <span className="result-desc">{geminiResult.description}</span>
            )}
            {results.length > 1 && (
              <div className="variant-row">
                {results.map((_, i) => (
                  <button
                    key={i}
                    className={`variant-btn${selectedIndex === i ? ' on' : ''}`}
                    onClick={() => setSelectedIndex(i)}
                  >
                    {VAR_LABELS[i]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 選択中のトラックカード */}
          {currentTrack && (
            <div className="gen-card">
              <div className="gen-card-main">
                <button className="gen-play" onClick={() => audioPlay(currentTrack)}>▶</button>
                <div>
                  <div className="gen-name">
                    {currentTrack.name}
                    <span className="ai-tag">✦ AI提案</span>
                  </div>
                  <div className="gen-meta">
                    {currentTrack.tags.slice(0, 3).map(t => (
                      <span key={t} className="gen-tag">{t}</span>
                    ))}
                    {currentTrack.bpm && <span className="gen-bpm">{currentTrack.bpm} BPM</span>}
                    <span className="gen-dur">{Math.floor(currentTrack.duration / 60)}:{String(Math.floor(currentTrack.duration % 60)).padStart(2, '0')}</span>
                    <span className="gen-tag">CC0</span>
                  </div>
                </div>
                <div className="gen-right">
                  <a
                    className="gen-dl-btn"
                    href={currentTrack.previews['preview-hq-mp3']}
                    download
                    target="_blank"
                    rel="noreferrer"
                    title="プレビューをダウンロード"
                  >↓</a>
                  <button
                    className="pin-btn"
                    onClick={() => togglePin(currentTrack.id, 'default')}
                    title="プレイリストに追加"
                  >📌</button>
                </div>
              </div>
              {/* シーンタグ */}
              <div className="gen-tag-area">
                <span className="tag-area-label">シーンに追加</span>
                {SCENES.map(s => (
                  <button
                    key={s.id}
                    className={`stag${sceneTags[currentTrack.id]?.has(s.id) ? ' on' : ''}`}
                    onClick={() => handleToggleScene(currentTrack.id, s.id)}
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 他のバリエーション一覧 */}
          {results.length > 1 && (
            <div className="variant-list">
              {results.map((t, i) => (
                <div
                  key={t.id}
                  className={`variant-item${selectedIndex === i ? ' on' : ''}`}
                  onClick={() => setSelectedIndex(i)}
                >
                  <span className="variant-item-label">{VAR_LABELS[i]}</span>
                  <span className="variant-item-name">{t.name}</span>
                  {t.bpm && <span className="variant-item-bpm">{t.bpm} BPM</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {status === 'done' && results.length === 0 && (
        <div className="empty-hint">
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
          <div>楽曲が見つかりませんでした</div>
          <div style={{ fontSize: 12, color: '#6b6a64', marginTop: 4 }}>キーワードを変えて再試行してください</div>
        </div>
      )}
    </div>
  )
}
