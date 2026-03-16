import { useAppStore } from './store/appStore'
import { Topbar } from './components/layout/Topbar'
import { Sidebar } from './components/layout/Sidebar'
import { PlayerBar } from './components/layout/PlayerBar'
import { SearchPanel } from './components/search/SearchPanel'
import { ScenePanel } from './components/scene/ScenePanel'
import { PlaylistPanel } from './components/playlist/PlaylistPanel'
import { SEPanel } from './components/se/SEPanel'

function App() {
  const { currentTab } = useAppStore()

  const MainPanel = () => {
    switch (currentTab) {
      case 'search':   return <SearchPanel />
      case 'scenes':   return <ScenePanel />
      case 'playlist': return <PlaylistPanel />
      case 'se':       return <SEPanel />
    }
  }

  const showSidebar = currentTab !== 'se'

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: '60px 1fr 70px',
        gridTemplateColumns: showSidebar ? '240px 1fr' : '1fr',
        background: '#0d0f14',
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <Topbar />
      {showSidebar && <Sidebar />}
      <main style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <MainPanel />
      </main>
      <PlayerBar />
    </div>
  )
}

export default App
