// SEエンジン — Web Audio API でSEを合成生成する
// 音源ファイルは一切使わない

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function gain(ctx: AudioContext, value: number): GainNode {
  const g = ctx.createGain()
  g.gain.value = value
  g.connect(ctx.destination)
  return g
}

// ────────────────────────────────────
// クイズ系
// ────────────────────────────────────

/** ⭕ 正解！ — 上昇チャイム (C5 → E5 → G5) */
export function playCorrect() {
  const c = getCtx()
  const freqs = [523, 659, 784]
  freqs.forEach((freq, i) => {
    const osc = c.createOscillator()
    const g = gain(c, 0.3)
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.connect(g)
    const t = c.currentTime + i * 0.15
    g.gain.setValueAtTime(0.3, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    osc.start(t)
    osc.stop(t + 0.4)
  })
}

/** ❌ 不正解 — 下降ブザー */
export function playWrong() {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = gain(c, 0.4)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(300, c.currentTime)
  osc.frequency.linearRampToValueAtTime(80, c.currentTime + 0.6)
  osc.connect(g)
  g.gain.setValueAtTime(0.4, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.7)
  osc.start()
  osc.stop(c.currentTime + 0.7)
}

/** ⏱ タイムアップ — 長めのビープ */
export function playTimeUp() {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = gain(c, 0.35)
  osc.type = 'square'
  osc.frequency.value = 880
  osc.connect(g)
  g.gain.setValueAtTime(0.35, c.currentTime)
  g.gain.setValueAtTime(0.35, c.currentTime + 1.5)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.8)
  osc.start()
  osc.stop(c.currentTime + 1.8)
}

/** ⏰ カウントダウン — 3・2・1 ビープ */
export function playCountdown() {
  const c = getCtx()
  ;[0, 1, 2].forEach((i) => {
    const osc = c.createOscillator()
    const g = gain(c, 0.3)
    osc.type = 'sine'
    osc.frequency.value = i === 2 ? 1047 : 659
    osc.connect(g)
    const t = c.currentTime + i * 1.0
    g.gain.setValueAtTime(0.3, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    osc.start(t)
    osc.stop(t + 0.3)
  })
}

/** 🏆 グランプリ — ファンファーレ風 */
export function playGrandprix() {
  const c = getCtx()
  const notes = [
    { freq: 523, t: 0.0, dur: 0.2 },
    { freq: 659, t: 0.2, dur: 0.2 },
    { freq: 784, t: 0.4, dur: 0.2 },
    { freq: 1047, t: 0.6, dur: 0.8 },
  ]
  notes.forEach(({ freq, t, dur }) => {
    const osc = c.createOscillator()
    const g = gain(c, 0.35)
    osc.type = 'triangle'
    osc.frequency.value = freq
    osc.connect(g)
    const start = c.currentTime + t
    g.gain.setValueAtTime(0.35, start)
    g.gain.exponentialRampToValueAtTime(0.001, start + dur)
    osc.start(start)
    osc.stop(start + dur)
  })
}

/** 🤔 シンキングタイム — ループBGM（停止は stopThinking() で） */
let thinkingOsc: OscillatorNode | null = null
export function playThinking() {
  const c = getCtx()
  thinkingOsc = c.createOscillator()
  const g = gain(c, 0.1)
  thinkingOsc.type = 'sine'
  thinkingOsc.frequency.setValueAtTime(330, c.currentTime)
  thinkingOsc.frequency.linearRampToValueAtTime(440, c.currentTime + 2)
  thinkingOsc.connect(g)
  thinkingOsc.start()
}
export function stopThinking() {
  thinkingOsc?.stop()
  thinkingOsc = null
}

// ────────────────────────────────────
// クラブ・DJ系
// ────────────────────────────────────

/** 📣 エアホーン */
export function playAirhorn() {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = gain(c, 0.5)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(233, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(110, c.currentTime + 0.8)
  osc.connect(g)
  g.gain.setValueAtTime(0.5, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8)
  osc.start(); osc.stop(c.currentTime + 0.8)
}

/** 🚨 DJサイレン — 上下するサイレン音 */
export function playSiren() {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = gain(c, 0.3)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(400, c.currentTime)
  osc.frequency.linearRampToValueAtTime(800, c.currentTime + 0.5)
  osc.frequency.linearRampToValueAtTime(400, c.currentTime + 1.0)
  osc.frequency.linearRampToValueAtTime(800, c.currentTime + 1.5)
  osc.frequency.linearRampToValueAtTime(400, c.currentTime + 2.0)
  osc.connect(g)
  g.gain.setValueAtTime(0.3, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 2.1)
  osc.start(); osc.stop(c.currentTime + 2.1)
}

/** 💥 インパクトヒット — 低域の一撃 */
export function playImpact() {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = gain(c, 0.7)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(20, c.currentTime + 0.4)
  osc.connect(g)
  g.gain.setValueAtTime(0.7, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5)
  osc.start(); osc.stop(c.currentTime + 0.5)
}

/** 🔔 ライザー — 周波数上昇 */
export function playRiser(duration = 4) {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = gain(c, 0.15)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(80, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(2000, c.currentTime + duration)
  osc.connect(g)
  g.gain.setValueAtTime(0.05, c.currentTime)
  g.gain.linearRampToValueAtTime(0.3, c.currentTime + duration * 0.8)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  osc.start(); osc.stop(c.currentTime + duration)
}

// ────────────────────────────────────
// ドラムロール系
// ────────────────────────────────────

function snareRoll(duration: number) {
  const c = getCtx()
  const interval = 0.05
  const steps = Math.floor(duration / interval)
  for (let i = 0; i < steps; i++) {
    const buf = c.createBuffer(1, c.sampleRate * 0.05, c.sampleRate)
    const data = buf.getChannelData(0)
    for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * 0.4
    const src = c.createBufferSource()
    src.buffer = buf
    const g = gain(c, 0.5 + (i / steps) * 0.5)
    src.connect(g)
    src.start(c.currentTime + i * interval)
  }
}

function cymbal(time: number) {
  const c = getCtx()
  const buf = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.1))
  const src = c.createBufferSource()
  src.buffer = buf
  const g = gain(c, 0.8)
  src.connect(g)
  src.start(time)
}

/** 🥁 ドラムロール（短）2秒 */
export function playDrumShort() {
  const c = getCtx()
  snareRoll(2.0)
  cymbal(c.currentTime + 2.0)
}

/** 🥁 ドラムロール（中）5秒 */
export function playDrumMid() {
  const c = getCtx()
  snareRoll(5.0)
  cymbal(c.currentTime + 5.0)
}

/** 🥁 ドラムロール（長）10秒 */
export function playDrumLong() {
  const c = getCtx()
  snareRoll(10.0)
  cymbal(c.currentTime + 10.0)
  setTimeout(() => playGrandprix(), 10200)
}

// ────────────────────────────────────
// 汎用SE
// ────────────────────────────────────

/** 👏 拍手 — ホワイトノイズバースト */
export function playApplause(duration = 4) {
  const c = getCtx()
  const buf = c.createBuffer(1, c.sampleRate * duration, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const env = Math.sin((i / c.sampleRate) * Math.PI * (duration * 0.5))
    data[i] = (Math.random() * 2 - 1) * 0.3 * env
  }
  const src = c.createBufferSource()
  src.buffer = buf
  src.connect(c.destination)
  src.start()
}

/** 🔔 チャイム1回 */
export function playChime1() {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = gain(c, 0.4)
  osc.type = 'sine'
  osc.frequency.value = 1047
  osc.connect(g)
  g.gain.setValueAtTime(0.4, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 2.0)
  osc.start(); osc.stop(c.currentTime + 2.0)
}

/** 🔔 チャイム3回 */
export function playChime3() {
  ;[0, 0.6, 1.2].forEach((offset) => {
    setTimeout(playChime1, offset * 1000)
  })
}

/** 📯 ファンファーレ（グランプリと同等） */
export const playFanfare = playGrandprix

// ────────────────────────────────────
// SEItem.id → 再生関数のマップ
// ────────────────────────────────────

export const SE_PLAY_MAP: Record<string, () => void> = {
  s1:  playCorrect,
  s2:  playWrong,
  s3:  playTimeUp,
  s4:  playCountdown,
  s5:  playGrandprix,
  s6:  playThinking,
  s7:  playAirhorn,
  s8:  playSiren,
  s9:  () => {},           // スクラッチ — 要実装（ノイズ+ピッチシフト）
  s10: () => playRiser(8),
  s11: () => playRiser(4),
  s12: playImpact,
  s13: playDrumShort,
  s14: playDrumMid,
  s15: playDrumLong,
  s16: playDrumShort,      // スネアフィル → 短ロール流用
  s17: playCorrect,        // タンタン+ジャン → 簡易実装
  s18: () => { playDrumShort(); setTimeout(playApplause, 2600) },
  s19: playApplause,
  s20: () => { playImpact(); setTimeout(playApplause, 300) },
  s21: playChime1,
  s22: playChime3,
  s23: playFanfare,
  s24: playCorrect,        // ジングル → 要調整
}
