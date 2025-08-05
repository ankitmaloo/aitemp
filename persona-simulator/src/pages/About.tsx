import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Code, Palette, Zap } from 'lucide-react'

export function About() {
  return (
    <main className="px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            About Persona Simulator
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: 'hsl(215, 16%, 47%)' }}>
            A modern design system showcase built with React, TypeScript, and cutting-edge UI patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="neumorphic">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Modern Tech Stack</CardTitle>
                  <CardDescription>Built with the latest technologies</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• React 19 with TypeScript</li>
                <li>• Vite for fast development</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Radix UI for accessibility</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800">
                  <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Design Patterns</CardTitle>
                  <CardDescription>Exploring modern UI trends</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Neumorphism & soft shadows</li>
                <li>• Glassmorphism effects</li>
                <li>• Claymorphism textures</li>
                <li>• Ambient lighting</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-green-900 dark:text-green-100">User Experience</CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    Focused on accessibility and usability
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• WCAG 2.1 compliance</li>
                <li>• Keyboard navigation</li>
                <li>• Screen reader support</li>
                <li>• High contrast modes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-800">
                  <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-orange-900 dark:text-orange-100">Performance</CardTitle>
                  <CardDescription className="text-orange-700 dark:text-orange-300">
                    Optimized for speed and efficiency
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                <li>• Fast Vite build system</li>
                <li>• Optimized bundle size</li>
                <li>• Lazy loading components</li>
                <li>• Efficient CSS-in-JS</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Ready to explore?
          </h2>
          <p className="mb-8" style={{ color: 'var(--muted)' }}>
            Dive into the interactive showcase and experience modern design patterns
          </p>
          <Button size="lg" className="ambient-glow">
            <Zap className="w-5 h-5 mr-2" />
            Explore Components
          </Button>
        </div>
      </div>
    </main>
  )
}