// SEエンジン — Web Audio API でSEを合成生成する
// 音源ファイルは一切使わない

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ── 排他制御 ──
let activeNodes: (OscillatorNode | AudioBufferSourceNode)[] = []
let thinkingOsc: OscillatorNode | null = null

function stopAll() {
  activeNodes.forEach(n => {
    try { n.stop() } catch {}
  })
  activeNodes = []
  thinkingOsc = null
}

function track<T extends OscillatorNode | AudioBufferSourceNode>(node: T): T {
  activeNodes.push(node)
  return node
}

export { stopAll as stopAllSE }

// ────────────────────────────────────
// クイズ系
// ────────────────────────────────────

// ⭕ 正解 — 明るい3音上昇チャイム
export function playCorrect() {
  stopAll()
  const c = getCtx()
  ;[523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = track(c.createOscillator())
    const g = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, c.currentTime + i * 0.13)
    g.gain.linearRampToValueAtTime(0.35, c.currentTime + i * 0.13 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.13 + 0.5)
    osc.connect(g); g.connect(c.destination)
    osc.start(c.currentTime + i * 0.13)
    osc.stop(c.currentTime + i * 0.13 + 0.55)
  })
}

// ❌ 不正解 — 低い2音下降ブザー
export function playWrong() {
  stopAll()
  const c = getCtx()
  ;[220, 146.83].forEach((freq, i) => {
    const osc = track(c.createOscillator())
    const g = c.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = freq
    g.gain.setValueAtTime(0.4, c.currentTime + i * 0.22)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.22 + 0.3)
    osc.connect(g); g.connect(c.destination)
    osc.start(c.currentTime + i * 0.22)
    osc.stop(c.currentTime + i * 0.22 + 0.35)
  })
}

// ⏱ タイムアップ — 連続ビープが下降
export function playTimeUp() {
  stopAll()
  const c = getCtx()
  ;[880, 880, 880, 440].forEach((freq, i) => {
    const osc = track(c.createOscillator())
    const g = c.createGain()
    osc.type = 'square'
    osc.frequency.value = freq
    const t = c.currentTime + i * 0.22
    g.gain.setValueAtTime(0.2, t)
    g.gain.setValueAtTime(0.2, t + 0.15)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    osc.connect(g); g.connect(c.destination)
    osc.start(t); osc.stop(t + 0.22)
  })
}

// ⏰ カウントダウン — 3回ビープ + 高音ゴー
export function playCountdown() {
  stopAll()
  const c = getCtx()
  ;[659, 659, 659, 1047].forEach((freq, i) => {
    const osc = track(c.createOscillator())
    const g = c.createGain()
    osc.type = i === 3 ? 'sine' : 'square'
    osc.frequency.value = freq
    const t = c.currentTime + i * 0.9
    g.gain.setValueAtTime(0.25, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + (i === 3 ? 0.8 : 0.18))
    osc.connect(g); g.connect(c.destination)
    osc.start(t); osc.stop(t + (i === 3 ? 0.85 : 0.22))
  })
}

// 🏆 グランプリ — 上昇ファンファーレ
export function playGrandprix() {
  stopAll()
  const c = getCtx()
  const notes = [
    {f:523, t:0.0, d:0.15},
    {f:523, t:0.15,d:0.15},
    {f:523, t:0.3, d:0.15},
    {f:659, t:0.45,d:0.5},
    {f:622, t:0.95,d:0.15},
    {f:659, t:1.1, d:0.15},
    {f:784, t:1.25,d:0.8},
  ]
  notes.forEach(({f,t,d}) => {
    const osc = track(c.createOscillator())
    const g = c.createGain()
    osc.type = 'triangle'
    osc.frequency.value = f
    g.gain.setValueAtTime(0.3, c.currentTime + t)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + d)
    osc.connect(g); g.connect(c.destination)
    osc.start(c.currentTime + t)
    osc.stop(c.currentTime + t + d + 0.05)
  })
}

// 🤔 シンキングタイム — ループBGM（停止は stopThinking() で）
export function playThinking() {
  stopAll()
  const c = getCtx()
  thinkingOsc = track(c.createOscillator())
  const g = c.createGain()
  g.gain.value = 0.1
  g.connect(c.destination)
  thinkingOsc.type = 'sine'
  thinkingOsc.frequency.setValueAtTime(330, c.currentTime)
  thinkingOsc.frequency.linearRampToValueAtTime(440, c.currentTime + 2)
  thinkingOsc.connect(g)
  thinkingOsc.start()
}
export function stopThinking() {
  stopAll()
}

// ────────────────────────────────────
// クラブ・DJ系
// ────────────────────────────────────

// 📣 エアホーン — 低域の大きなホーン
export function playAirhorn() {
  stopAll()
  const c = getCtx()
  const osc = track(c.createOscillator())
  const g = c.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(116, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(87, c.currentTime + 1.0)
  g.gain.setValueAtTime(0.6, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.2)
  osc.connect(g); g.connect(c.destination)
  osc.start(); osc.stop(c.currentTime + 1.3)
}

// 🚨 DJサイレン
export function playSiren() {
  stopAll()
  const c = getCtx()
  const osc = track(c.createOscillator())
  const g = c.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(440, c.currentTime)
  osc.frequency.linearRampToValueAtTime(880, c.currentTime + 0.4)
  osc.frequency.linearRampToValueAtTime(440, c.currentTime + 0.8)
  osc.frequency.linearRampToValueAtTime(880, c.currentTime + 1.2)
  osc.frequency.linearRampToValueAtTime(440, c.currentTime + 1.6)
  osc.frequency.linearRampToValueAtTime(880, c.currentTime + 2.0)
  g.gain.setValueAtTime(0.3, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 2.1)
  osc.connect(g); g.connect(c.destination)
  osc.start(); osc.stop(c.currentTime + 2.2)
}

// 💥 インパクトヒット — 低域ドン
export function playImpact() {
  stopAll()
  const c = getCtx()
  const osc = track(c.createOscillator())
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(80, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(20, c.currentTime + 0.3)
  g.gain.setValueAtTime(0.8, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4)
  osc.connect(g); g.connect(c.destination)
  osc.start(); osc.stop(c.currentTime + 0.45)
}

// 🔔 ライザー — 周波数上昇
export function playRiser(duration = 4) {
  stopAll()
  const c = getCtx()
  const osc = track(c.createOscillator())
  const g = c.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(80, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(2000, c.currentTime + duration)
  g.gain.setValueAtTime(0.05, c.currentTime)
  g.gain.linearRampToValueAtTime(0.3, c.currentTime + duration * 0.8)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  osc.connect(g); g.connect(c.destination)
  osc.start(); osc.stop(c.currentTime + duration)
}

// ────────────────────────────────────
// ドラムロール系
// ────────────────────────────────────

// 🥁 ドラムロール（短）— ホワイトノイズのロール + シンバル
export function playDrumShort() {
  stopAll()
  const c = getCtx()
  const dur = 2.0
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const progress = i / data.length
    const roll = Math.sin(progress * Math.PI * 40) > 0 ? 1 : 0
    data[i] = (Math.random() * 2 - 1) * 0.4 * roll * (0.3 + progress * 0.7)
  }
  const src = track(c.createBufferSource())
  src.buffer = buf
  src.connect(c.destination)
  src.start()
  // シンバル
  const cbuf = c.createBuffer(1, c.sampleRate * 0.4, c.sampleRate)
  const cdata = cbuf.getChannelData(0)
  for (let i = 0; i < cdata.length; i++) {
    cdata[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.06))
  }
  const csrc = track(c.createBufferSource())
  csrc.buffer = cbuf
  const cg = c.createGain(); cg.gain.value = 0.8
  csrc.connect(cg); cg.connect(c.destination)
  csrc.start(c.currentTime + dur)
}

// 🥁 ドラムロール（中）5秒
export function playDrumMid() {
  stopAll()
  const c = getCtx()
  const dur = 5.0
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const progress = i / data.length
    const roll = Math.sin(progress * Math.PI * 40) > 0 ? 1 : 0
    data[i] = (Math.random() * 2 - 1) * 0.4 * roll * (0.3 + progress * 0.7)
  }
  const src = track(c.createBufferSource())
  src.buffer = buf
  src.connect(c.destination)
  src.start()
  const cbuf = c.createBuffer(1, c.sampleRate * 0.4, c.sampleRate)
  const cdata = cbuf.getChannelData(0)
  for (let i = 0; i < cdata.length; i++) {
    cdata[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.06))
  }
  const csrc = track(c.createBufferSource())
  csrc.buffer = cbuf
  const cg = c.createGain(); cg.gain.value = 0.8
  csrc.connect(cg); cg.connect(c.destination)
  csrc.start(c.currentTime + dur)
}

// 🥁 ドラムロール（長）10秒
export function playDrumLong() {
  stopAll()
  const c = getCtx()
  const dur = 10.0
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const progress = i / data.length
    const roll = Math.sin(progress * Math.PI * 40) > 0 ? 1 : 0
    data[i] = (Math.random() * 2 - 1) * 0.4 * roll * (0.3 + progress * 0.7)
  }
  const src = track(c.createBufferSource())
  src.buffer = buf
  src.connect(c.destination)
  src.start()
  const cbuf = c.createBuffer(1, c.sampleRate * 0.4, c.sampleRate)
  const cdata = cbuf.getChannelData(0)
  for (let i = 0; i < cdata.length; i++) {
    cdata[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.06))
  }
  const csrc = track(c.createBufferSource())
  csrc.buffer = cbuf
  const cg = c.createGain(); cg.gain.value = 0.8
  csrc.connect(cg); cg.connect(c.destination)
  csrc.start(c.currentTime + dur)
}

// ────────────────────────────────────
// 汎用SE
// ────────────────────────────────────

// 👏 拍手 — ノイズバースト連続
export function playApplause(duration = 3.5) {
  stopAll()
  const c = getCtx()
  const buf = c.createBuffer(1, c.sampleRate * duration, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const p = i / data.length
    const env = Math.sin(p * Math.PI)
    const clap = Math.abs(Math.sin(i / c.sampleRate * Math.PI * 8)) > 0.7 ? 1 : 0.1
    data[i] = (Math.random() * 2 - 1) * 0.35 * env * clap
  }
  const src = track(c.createBufferSource())
  src.buffer = buf
  src.connect(c.destination)
  src.start()
}

// 🔔 チャイム1回 — 澄んだサイン波
export function playChime1() {
  stopAll()
  const c = getCtx()
  ;[1046.5, 1318.5].forEach((freq, i) => {
    const osc = track(c.createOscillator())
    const g = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.setValueAtTime(0.3 - i * 0.1, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 2.0)
    osc.connect(g); g.connect(c.destination)
    osc.start(); osc.stop(c.currentTime + 2.1)
  })
}

// 🔔 チャイム3回
export function playChime3() {
  stopAll()
  const c = getCtx()
  ;[0, 0.6, 1.2].forEach((offset) => {
    ;[1046.5, 1318.5].forEach((freq, fi) => {
      const osc = track(c.createOscillator())
      const g = c.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = c.currentTime + offset
      g.gain.setValueAtTime(0.3 - fi * 0.1, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
      osc.connect(g); g.connect(c.destination)
      osc.start(t); osc.stop(t + 0.55)
    })
  })
}

// 📯 ファンファーレ（グランプリと同等）
export function playFanfare() {
  playGrandprix()
}

// 🎸 スクラッチ — ノイズ+ピッチシフト
export function playScratch() {
  stopAll()
  const c = getCtx()
  const dur = 0.4
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5
  }
  const src = track(c.createBufferSource())
  src.buffer = buf
  src.playbackRate.setValueAtTime(1.5, c.currentTime)
  src.playbackRate.linearRampToValueAtTime(0.3, c.currentTime + dur * 0.5)
  src.playbackRate.linearRampToValueAtTime(2.0, c.currentTime + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.5, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
  src.connect(g); g.connect(c.destination)
  src.start()
}

// 🎵 ドロップビルド — ライザー → インパクト
export function playDropBuild() {
  stopAll()
  const c = getCtx()
  const osc = track(c.createOscillator())
  const g = c.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(100, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(1500, c.currentTime + 2.0)
  g.gain.setValueAtTime(0.05, c.currentTime)
  g.gain.linearRampToValueAtTime(0.4, c.currentTime + 1.8)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 2.1)
  osc.connect(g); g.connect(c.destination)
  osc.start(); osc.stop(c.currentTime + 2.2)
  // インパクト
  const osc2 = track(c.createOscillator())
  const g2 = c.createGain()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(80, c.currentTime + 2.1)
  osc2.frequency.exponentialRampToValueAtTime(20, c.currentTime + 2.4)
  g2.gain.setValueAtTime(0.8, c.currentTime + 2.1)
  g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 2.5)
  osc2.connect(g2); g2.connect(c.destination)
  osc2.start(c.currentTime + 2.1); osc2.stop(c.currentTime + 2.55)
}

// 🥁 スネアフィル — 加速するスネアヒット
export function playSnareFill() {
  stopAll()
  const c = getCtx()
  const dur = 1.5
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const progress = i / data.length
    const hitRate = 8 + progress * 24
    const hit = Math.sin(progress * Math.PI * hitRate) > 0.5 ? 1 : 0
    data[i] = (Math.random() * 2 - 1) * 0.45 * hit * (0.4 + progress * 0.6)
  }
  const src = track(c.createBufferSource())
  src.buffer = buf
  src.connect(c.destination)
  src.start()
}

// 🎶 タンタン+ジャン — リズミカルな3打
export function playTantanJan() {
  stopAll()
  const c = getCtx()
  ;[440, 440, 880].forEach((freq, i) => {
    const osc = track(c.createOscillator())
    const g = c.createGain()
    osc.type = i === 2 ? 'triangle' : 'square'
    osc.frequency.value = freq
    const t = c.currentTime + i * 0.25
    const vol = i === 2 ? 0.4 : 0.25
    const dur = i === 2 ? 0.6 : 0.15
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    osc.connect(g); g.connect(c.destination)
    osc.start(t); osc.stop(t + dur + 0.05)
  })
}

// 🥁+👏 ドラム+拍手
export function playDrumApplause() {
  stopAll()
  const c = getCtx()
  // 短いドラムロール
  const rDur = 1.5
  const rBuf = c.createBuffer(1, c.sampleRate * rDur, c.sampleRate)
  const rData = rBuf.getChannelData(0)
  for (let i = 0; i < rData.length; i++) {
    const progress = i / rData.length
    const roll = Math.sin(progress * Math.PI * 40) > 0 ? 1 : 0
    rData[i] = (Math.random() * 2 - 1) * 0.4 * roll * (0.3 + progress * 0.7)
  }
  const rSrc = track(c.createBufferSource())
  rSrc.buffer = rBuf
  rSrc.connect(c.destination)
  rSrc.start()
  // 拍手（遅延開始）
  const aDur = 2.5
  const aBuf = c.createBuffer(1, c.sampleRate * aDur, c.sampleRate)
  const aData = aBuf.getChannelData(0)
  for (let i = 0; i < aData.length; i++) {
    const p = i / aData.length
    const env = Math.sin(p * Math.PI)
    const clap = Math.abs(Math.sin(i / c.sampleRate * Math.PI * 8)) > 0.7 ? 1 : 0.1
    aData[i] = (Math.random() * 2 - 1) * 0.3 * env * clap
  }
  const aSrc = track(c.createBufferSource())
  aSrc.buffer = aBuf
  aSrc.connect(c.destination)
  aSrc.start(c.currentTime + rDur)
}

// 🎊 クラッカー — インパクト + 拍手
export function playCracker() {
  stopAll()
  const c = getCtx()
  // パン！
  const osc = track(c.createOscillator())
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(100, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(20, c.currentTime + 0.15)
  g.gain.setValueAtTime(0.8, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2)
  osc.connect(g); g.connect(c.destination)
  osc.start(); osc.stop(c.currentTime + 0.25)
  // シュワー（ノイズ）
  const dur = 1.0
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3 * Math.exp(-i / (c.sampleRate * 0.3))
  }
  const src = track(c.createBufferSource())
  src.buffer = buf
  src.connect(c.destination)
  src.start(c.currentTime + 0.05)
}

// 🎵 ジングル — 短いメロディ
export function playJingle() {
  stopAll()
  const c = getCtx()
  const notes = [
    {f:659, t:0, d:0.15},
    {f:784, t:0.15, d:0.15},
    {f:1047, t:0.3, d:0.4},
    {f:784, t:0.7, d:0.15},
    {f:1047, t:0.85, d:0.5},
  ]
  notes.forEach(({f,t,d}) => {
    const osc = track(c.createOscillator())
    const g = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = f
    g.gain.setValueAtTime(0.3, c.currentTime + t)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + d)
    osc.connect(g); g.connect(c.destination)
    osc.start(c.currentTime + t)
    osc.stop(c.currentTime + t + d + 0.05)
  })
}

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
  s9:  playScratch,
  s10: playDropBuild,
  s11: () => playRiser(4),
  s12: playImpact,
  s13: playDrumShort,
  s14: playDrumMid,
  s15: playDrumLong,
  s16: playSnareFill,
  s17: playTantanJan,
  s18: playDrumApplause,
  s19: playApplause,
  s20: playCracker,
  s21: playChime1,
  s22: playChime3,
  s23: playFanfare,
  s24: playJingle,
}
