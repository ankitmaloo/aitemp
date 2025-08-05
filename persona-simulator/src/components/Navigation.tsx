import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Users, Home, Info, MessageCircle, Plus } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  return (
    <header className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-3">
          <div className="p-2 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--primary)' }}>
            <Users className="w-8 h-8" style={{ color: 'hsl(210, 40%, 98%)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Persona Simulator
            </h1>
            <p className="text-sm" style={{ color: 'hsl(215, 16%, 47%)' }}>Design System Showcase</p>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/chat' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/chat">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/list-creator' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/list-creator">
                <Plus className="w-4 h-4 mr-2" />
                Create List
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/about' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/about">
                <Info className="w-4 h-4 mr-2" />
                About
              </Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}