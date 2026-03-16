const BASE = 'https://freesound.org/apiv2'
const KEY  = import.meta.env.VITE_FREESOUND_API_KEY

export interface FreesoundResult {
  id: number
  name: string
  duration: number
  previews: { 'preview-hq-mp3': string }
  bpm: number | null
  tags: string[]
  license: string
}

export async function searchBGM(query: string): Promise<FreesoundResult[]> {
  if (!KEY) { throw new Error('APIキーが未設定です') }
  const params = new URLSearchParams({
    query,
    fields: 'id,name,duration,previews,bpm,tags,license',
    page_size: '8',
    token: KEY,
  })
  console.log('Freesound検索URL:', `${BASE}/search/text/?${params}`)
  const res = await fetch(`${BASE}/search/text/?${params}`)
  if (!res.ok) throw new Error(`Freesound error: ${res.status}`)
  const json = await res.json()
  console.log('Freesound生データ:', JSON.stringify(json.results?.slice(0, 2), null, 2))
  return json.results as FreesoundResult[]
}

export async function searchBGMMultiple(
  queries: string[],
  bpmMin?: number,
  bpmMax?: number,
  maxDurationSec?: number
): Promise<FreesoundResult[]> {
  const results = await Promise.allSettled(
    queries.map(q => searchBGM(q))
  )

  const all: FreesoundResult[] = []
  const seen = new Set<number>()

  results.forEach(r => {
    if (r.status === 'fulfilled') {
      r.value.forEach(track => {
        if (!seen.has(track.id)) {
          seen.add(track.id)
          all.push(track)
        }
      })
    }
  })

  return all.filter(t => {
    if (bpmMin && t.bpm && t.bpm < bpmMin) return false
    if (bpmMax && t.bpm && t.bpm > bpmMax) return false
    if (maxDurationSec && t.duration > maxDurationSec) return false
    return true
  })
}
