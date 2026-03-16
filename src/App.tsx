import { useState } from 'react'
import type { Tab } from './types'
import { Topbar } from './components/layout/Topbar'
import { Sidebar } from './components/layout/Sidebar'
import { PlayerBar } from './components/layout/PlayerBar'
import { BGMPanel } from './components/bgm/BGMPanel'
import { SEPanel } from './components/se/SEPanel'

function App() {
  const [tab, setTab] = useState<Tab>('bgm')

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: '64px 1fr 72px',
        gridTemplateColumns: '260px 1fr',
        background: '#0d0f14',
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <Topbar tab={tab} onTabChange={setTab} />
      <Sidebar tab={tab} />
      <main style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        {tab === 'bgm' ? <BGMPanel /> : <SEPanel />}
      </main>
      <PlayerBar />
    </div>
  )
}

export default App
