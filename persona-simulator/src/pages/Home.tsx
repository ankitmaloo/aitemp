import { 
  HeroSection, 
  DesignShowcase, 
  ButtonShowcase, 
  GlassCardShowcase, 
  FeatureCards 
} from '@/lib/components'

export function Home() {
  return (
    <main className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <HeroSection />
        <DesignShowcase />
        <ButtonShowcase />
        <GlassCardShowcase />
        <FeatureCards />
      </div>
    </main>
  )
}