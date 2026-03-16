import type { Scene } from '../types'

export const SCENES: Scene[] = [
  {
    id: 'nyuure', icon: '🚪', name: '客入れ',
    sub: '開場〜開演前 / 来場者を迎える',
    bpm: '80–110', mood: '落ち着き・期待感', dur: 'ループ推奨', count: '18曲',
    tracks: [
      { id: 't1', name: 'Gentle Morning Jazz',  tags: ['ジャズ','ループ可'], mood: '落ち着き', bpm: 88,  dur: '3:22', score: 96 },
      { id: 't2', name: 'Bossa Nova Lounge',    tags: ['ボッサ','ループ可'], mood: '期待感',  bpm: 94,  dur: '4:05', score: 91 },
      { id: 't3', name: 'Sunday Morning Cafe',  tags: ['アコギ','ループ可'], mood: '穏やか',  bpm: 82,  dur: '3:48', score: 87 },
    ],
  },
  {
    id: 'kyakudashi', icon: '🌅', name: '客出し',
    sub: '閉演後 / 余韻を残して送り出す',
    bpm: '70–100', mood: '余韻・温かみ', dur: 'フェードアウト可', count: '14曲',
    tracks: [
      { id: 't4', name: 'Twilight Waltz',             tags: ['ピアノ'],  mood: '余韻',   bpm: 78, dur: '3:55', score: 95 },
      { id: 't5', name: 'Au Revoir (String Ensemble)', tags: ['弦楽'],   mood: '温かみ', bpm: 72, dur: '4:20', score: 90 },
    ],
  },
  {
    id: 'opening', icon: '🎬', name: 'オープニング',
    sub: 'イベント開始 / 期待を高める',
    bpm: '110–140', mood: '高揚・ダイナミック', dur: '60–120秒', count: '21曲',
    tracks: [
      { id: 't6', name: 'Grand Intro Orchestral', tags: ['オーケストラ'],         mood: '高揚',      bpm: 128, dur: '1:30', score: 98 },
      { id: 't7', name: 'Electric Rise',           tags: ['エレクトロ'],           mood: 'ダイナミック', bpm: 136, dur: '1:15', score: 93 },
    ],
  },
  {
    id: 'toudan', icon: '🎤', name: '登壇',
    sub: '登壇者入場 / 注目を集める',
    bpm: '100–130', mood: '期待・格調', dur: '30–60秒', count: '16曲',
    tracks: [
      { id: 't8', name: 'Executive Entrance', tags: ['オーケストラ'], mood: '格調', bpm: 112, dur: '0:45', score: 97 },
      { id: 't9', name: 'Hero Walk',           tags: ['ブラス'],       mood: '期待', bpm: 118, dur: '0:50', score: 91 },
    ],
  },
  {
    id: 'kodan', icon: '👋', name: '降壇',
    sub: '退場 / 余韻を残す',
    bpm: '80–110', mood: '満足・温かみ', dur: '20–45秒', count: '12曲',
    tracks: [
      { id: 't10', name: 'Warm Exit',      tags: ['ピアノ'], mood: '温かみ', bpm: 88, dur: '0:38', score: 94 },
      { id: 't11', name: 'Closing Steps',  tags: ['弦楽'],   mood: '満足',   bpm: 92, dur: '0:42', score: 88 },
    ],
  },
  {
    id: 'kyuukei', icon: '☕', name: '休憩',
    sub: '休憩時間 / 気分をリセット',
    bpm: '70–95', mood: 'リラックス・自然', dur: 'ループ推奨', count: '20曲',
    tracks: [
      { id: 't12', name: 'Cafe Terrace',      tags: ['ジャズ','ループ可'],   mood: 'リラックス', bpm: 82, dur: '4:10', score: 96 },
      { id: 't13', name: 'Lofi Study Break',  tags: ['ローファイ','ループ可'], mood: '穏やか',    bpm: 78, dur: '3:50', score: 88 },
    ],
  },
  {
    id: 'kanpai', icon: '🥂', name: '乾杯',
    sub: '乾杯の瞬間 / 祝福・高揚',
    bpm: '120–150', mood: '祝福・アップリフト', dur: '15–30秒', count: '9曲',
    tracks: [
      { id: 't14', name: 'Champagne Pop',   tags: ['ブラス','エフェクト付き'], mood: '祝福', bpm: 140, dur: '0:20', score: 99 },
      { id: 't15', name: 'Fanfare Moment',  tags: ['オーケストラ'],            mood: '高揚', bpm: 132, dur: '0:25', score: 94 },
    ],
  },
  {
    id: 'konshinkai', icon: '🍻', name: '懇親会',
    sub: '交流・歓談 / 賑わいを演出',
    bpm: '90–125', mood: '楽しい・活気', dur: 'ループ推奨', count: '24曲',
    tracks: [
      { id: 't16', name: 'Party Lounge Jazz',  tags: ['ジャズ','ループ可'], mood: '活気',   bpm: 108, dur: '3:45', score: 95 },
      { id: 't17', name: 'Happy Hour Bossa',   tags: ['ボッサ','ループ可'], mood: '活気',   bpm: 98,  dur: '3:30', score: 88 },
    ],
  },
]
