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

export async function searchBGM(
  query: string,
  bpmMin?: number,
  bpmMax?: number,
): Promise<FreesoundResult[]> {
  const filterParts = [
    'license:"Creative Commons 0"',
    'duration:[60 TO *]',
  ]
  if (bpmMin != null && bpmMax != null) {
    filterParts.push(`bpm:[${bpmMin} TO ${bpmMax}]`)
  }
  const params = new URLSearchParams({
    query,
    filter: filterParts.join(' '),
    fields: 'id,name,duration,previews,bpm,tags,license',
    page_size: '10',
    token: KEY,
  })
  const res = await fetch(`${BASE}/search/text/?${params}`)
  if (!res.ok) throw new Error(`Freesound error: ${res.status}`)
  const json = await res.json()
  return json.results as FreesoundResult[]
}
