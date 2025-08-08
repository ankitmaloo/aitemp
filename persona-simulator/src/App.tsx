import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/Navigation'
import { Toaster } from '@/components/ui/sonner'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { Chat } from '@/pages/Chat'
import { ListCreator } from '@/pages/ListCreator'
import { Details } from '@/pages/Details'
import { ChatCopy } from './pages/ChatCopy'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="persona-simulator-theme">
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/c" element={<ChatCopy />} />
            <Route path="/list-creator" element={<ListCreator />} />
            <Route path="/details" element={<Details />} />
          </Routes>
          {/*<Footer />*/}
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App