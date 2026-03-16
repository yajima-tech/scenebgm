const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export interface GeminiSearchResult {
  queries: string[]
  genre: string
  mood: string
  bpmRange: [number, number]
  description: string
}

export async function promptToSearchQueries(
  prompt: string,
  genre: string,
  tempo: string,
  duration: string
): Promise<GeminiSearchResult> {
  if (!GEMINI_KEY) throw new Error('Gemini APIキーが未設定です')

  const systemPrompt = `
あなたはBGM検索の専門家です。ユーザーの日本語のイメージ説明から、
Freesound.orgで音楽を検索するための英語クエリを3つ生成してください。
クエリはCC0ライセンスの音楽が見つかりやすい具体的な英語キーワードにしてください。

以下のJSON形式のみで返答してください。説明文は不要です。

{
  "queries": ["クエリ1", "クエリ2", "クエリ3"],
  "genre": "判定ジャンル（日本語）",
  "mood": "ムード（日本語）",
  "bpmRange": [最小BPM, 最大BPM],
  "description": "このBGMの特徴の説明（日本語・1〜2文）"
}
`

  const userMessage = `
イメージ: ${prompt}
ジャンル指定: ${genre}
テンポ指定: ${tempo}
尺: ${duration}
`

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: systemPrompt + userMessage }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      }
    })
  })

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Geminiのレスポンスが不正です')

  return JSON.parse(jsonMatch[0]) as GeminiSearchResult
}
