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

  const text = `
あなたはBGM検索の専門家です。以下の条件でFreesound.orgの検索クエリを3つ生成してください。
必ずJSON形式のみで返答してください。説明文は不要です。

条件:
- イメージ: ${prompt}
- ジャンル: ${genre}
- テンポ: ${tempo}
- 尺: ${duration}

返答形式:
{
  "queries": ["英語クエリ1", "英語クエリ2", "英語クエリ3"],
  "genre": "ジャンル（日本語）",
  "mood": "ムード（日本語）",
  "bpmRange": [最小BPM, 最大BPM],
  "description": "このBGMの特徴（日本語・1文）"
}
`

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
    })
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini API error: ${res.status} ${errText}`)
  }

  const data = await res.json()
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Geminiのレスポンスが不正です: ' + responseText)

  return JSON.parse(jsonMatch[0]) as GeminiSearchResult
}
