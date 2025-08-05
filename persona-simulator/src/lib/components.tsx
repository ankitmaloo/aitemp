import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassCard } from '@/components/ui/glass-card'
import { Zap, Globe, Brain, Sparkles, Target } from 'lucide-react'
import { demoCardsData, featureCards } from './demo-data'
import { toast } from 'sonner'

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'brain':
      return <Brain className="w-6 h-6 text-gray-700 dark:text-gray-300" />
    case 'sparkles':
      return <Sparkles className="w-6 h-6 text-gray-900 dark:text-gray-100" />
    case 'target':
      return <Target className="w-6 h-6 text-gray-700 dark:text-gray-300" />
    default:
      return <Brain className="w-6 h-6 text-gray-700 dark:text-gray-300" />
  }
}

export function HeroSection() {
  return (
    <section className="text-center py-16">
      <div className="space-y-6">
        <h2 className="text-5xl md:text-7xl font-bold" style={{ color: 'var(--foreground)' }}>
          Modern Design
        </h2>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'hsl(215, 16%, 47%)' }}>
          Experience cutting-edge design patterns with neumorphism, glassmorphism, and ambient lighting effects
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <Button variant="default" size="lg" className="ambient-glow">
            <Zap className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            <Globe className="w-5 h-5 mr-2" />
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}

export function DesignShowcase() {
  const [activeDemo, setActiveDemo] = useState<string>('neumorphic')

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Design Elements</h3>
        <p style={{ color: 'var(--muted)' }}>Interactive showcase of modern design patterns</p>
      </div>

      {/* Demo Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex rounded-full p-1 shadow-lg" style={{ backgroundColor: 'var(--secondary)' }}>
          {demoCardsData.map((demo) => (
            <Button
              key={demo.id}
              variant={activeDemo === demo.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveDemo(demo.id)}
              className="rounded-full"
            >
              {getIcon(demo.iconType)}
              <span className="ml-2 hidden sm:inline">{demo.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Demo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {demoCardsData.map((demo) => (
          <Card
            key={demo.id}
            className={`${demo.className} transition-all duration-300 hover:scale-105 cursor-pointer ${activeDemo === demo.id ? 'ring-2 ring-blue-500' : ''
              }`}
            onClick={() => setActiveDemo(demo.id)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  {getIcon(demo.iconType)}
                </div>
                <div>
                  <CardTitle className="text-lg">{demo.title}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-8 bg-blue-100 dark:bg-blue-900 rounded"></div>
                  <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function ButtonShowcase() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Interactive Elements</h3>
        <p style={{ color: 'var(--muted)' }}>Various button styles and interactions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
        <Button variant="default" onClick={() => toast.success('Default button clicked!')}>Default</Button>
        <Button variant="neumorphic" onClick={() => toast.info('Neumorphic style activated!')}>Neumorphic</Button>
        <Button variant="glass" onClick={() => toast('Glass effect applied!')}>Glass</Button>
        <Button variant="clay" onClick={() => toast.warning('Clay texture engaged!')}>Clay</Button>
        <Button variant="outline" onClick={() => toast.error('Outline style selected!')}>Outline</Button>
        <Button variant="secondary" onClick={() => toast.success('Secondary action completed!')}>Secondary</Button>
        <Button variant="ghost" onClick={() => toast.info('Ghost mode activated!')}>Ghost</Button>
        <Button variant="link" onClick={() => toast('Link clicked!')}>Link</Button>
      </div>

      <div className="text-center">
        <div className="text-sm font-medium mb-4" style={{ color: 'var(--foreground)' }}>Toast Examples</div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" onClick={() => toast.success('Success! Operation completed.')}>Success</Button>
          <Button size="sm" onClick={() => toast.error('Error! Something went wrong.')}>Error</Button>
          <Button size="sm" onClick={() => toast.warning('Warning! Please check your input.')}>Warning</Button>
          <Button size="sm" onClick={() => toast.info('Info: Here\'s some helpful information.')}>Info</Button>
          <Button size="sm" onClick={() => toast('Default toast message.')}>Default</Button>
          <Button size="sm" onClick={() => toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: 'Loading...',
              success: 'Data loaded successfully!',
              error: 'Failed to load data.',
            }
          )}>Promise</Button>
        </div>
      </div>
    </section>
  )
}

export function GlassCardShowcase() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Premium Glass Card</h3>
        <p style={{ color: 'var(--muted)' }}>Stunning glassmorphism with animated marquee</p>
      </div>

      <div className="max-w-md mx-auto mb-16">
        <GlassCard />
      </div>
    </section>
  )
}

export function FeatureCards() {
  return (
    <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featureCards.map((feature) => (
          <Card key={feature.id} className={feature.className}>
            <CardHeader>
              <CardTitle className={feature.titleColor}>{feature.title}</CardTitle>
              <CardDescription className={feature.descriptionColor}>
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feature.features.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${item.color} rounded-full ${feature.id === 'responsive' ? 'animate-pulse' : ''}`}></div>
                    <span className={`text-sm ${item.textColor}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center" style={{ color: 'var(--muted)' }}>
          <p>&copy; 2025 Persona Simulator. Showcasing modern design patterns.</p>
        </div>
      </div>
    </footer>
  )
}