import type { SECategory } from '../types'

export const SE_CATS: SECategory[] = [
  {
    id: 'quiz', icon: '🎯', name: 'クイズ', sub: '正解・不正解・カウントダウンなど',
    items: [
      { id: 's1', emoji: '⭕', name: '正解！',          sub: '明るい上昇チャイム',   tags: ['クイズ'],           dur: '1.2s' },
      { id: 's2', emoji: '❌', name: '不正解',          sub: 'ブーッと下降音',       tags: ['クイズ'],           dur: '1.0s' },
      { id: 's3', emoji: '⏱', name: 'タイムアップ',    sub: 'ピーッとタイマー音',   tags: ['クイズ'],           dur: '1.8s' },
      { id: 's4', emoji: '⏰', name: 'カウントダウン',  sub: '3・2・1 ビープ',       tags: ['クイズ','カウント'], dur: '3.5s' },
      { id: 's5', emoji: '🏆', name: 'グランプリ',      sub: 'ファンファーレ＋歓声', tags: ['クイズ','表彰'],    dur: '4.0s' },
      { id: 's6', emoji: '🤔', name: 'シンキングタイム',sub: '考え中BGMループ',      tags: ['クイズ','ループ'],  dur: 'Loop' },
    ],
  },
  {
    id: 'club', icon: '🎧', name: 'クラブ・DJ', sub: 'エアホーン・サイレン・スクラッチなど',
    items: [
      { id: 's7',  emoji: '📣', name: 'エアホーン',        sub: '会場を沸かせるホーン',     tags: ['クラブ'],       dur: '0.8s' },
      { id: 's8',  emoji: '🚨', name: 'DJサイレン',        sub: '盛り上がりのサイレン',     tags: ['クラブ'],       dur: '2.0s' },
      { id: 's9',  emoji: '💿', name: 'スクラッチ',        sub: 'ターンテーブル音',         tags: ['クラブ'],       dur: '1.5s' },
      { id: 's10', emoji: '💣', name: 'ドロップビルド',    sub: 'EDMドロップ前の溜め',      tags: ['クラブ','EDM'], dur: '8.0s' },
      { id: 's11', emoji: '🔔', name: 'ライザー',          sub: 'テンション高めライザー',   tags: ['クラブ'],       dur: '4.0s' },
      { id: 's12', emoji: '💥', name: 'インパクトヒット',  sub: '強烈な一発ヒット音',       tags: ['クラブ'],       dur: '0.5s' },
    ],
  },
  {
    id: 'drum', icon: '🥁', name: 'ドラムロール', sub: '結果発表・登壇前の溜めに',
    items: [
      { id: 's13', emoji: '🥁', name: 'ドラムロール（短）',    sub: '2秒 → シンバル',           tags: ['ドラム'],        dur: '2.5s'  },
      { id: 's14', emoji: '🥁', name: 'ドラムロール（中）',    sub: '5秒 → シンバル＋鐘',       tags: ['ドラム'],        dur: '6.0s'  },
      { id: 's15', emoji: '🥁', name: 'ドラムロール（長）',    sub: '10秒 → フルファンファーレ', tags: ['ドラム','表彰'], dur: '11.0s' },
      { id: 's16', emoji: '🪘', name: 'スネアフィル',          sub: '4拍スネアフィル',           tags: ['ドラム'],        dur: '2.0s'  },
      { id: 's17', emoji: '🎺', name: 'タンタン＋ジャン',      sub: 'タタタタン！定番',          tags: ['ドラム','ブラス'],dur: '1.5s' },
      { id: 's18', emoji: '👏', name: 'ドラム＋拍手',          sub: 'ロール → 観客拍手',         tags: ['ドラム','拍手'], dur: '5.0s'  },
    ],
  },
  {
    id: 'misc', icon: '✨', name: '汎用SE', sub: '拍手・歓声・チャイムなど',
    items: [
      { id: 's19', emoji: '👏', name: '拍手（大）',     sub: '大会場の満場拍手',     tags: ['汎用'],        dur: '4.0s' },
      { id: 's20', emoji: '🎉', name: 'クラッカー＋歓声',sub: '場面転換・登場に',   tags: ['汎用'],        dur: '2.5s' },
      { id: 's21', emoji: '🔔', name: 'チャイム1回',   sub: '注目を集めるチャイム', tags: ['汎用'],        dur: '2.0s' },
      { id: 's22', emoji: '🔔', name: 'チャイム3回',   sub: '開演前アナウンス前',   tags: ['汎用'],        dur: '4.0s' },
      { id: 's23', emoji: '📯', name: 'ファンファーレ', sub: '登壇・表彰の定番',     tags: ['汎用','表彰'], dur: '3.5s' },
      { id: 's24', emoji: '🎵', name: 'ジングル',       sub: 'コーナー切り替えに',   tags: ['汎用'],        dur: '3.0s' },
    ],
  },
]
