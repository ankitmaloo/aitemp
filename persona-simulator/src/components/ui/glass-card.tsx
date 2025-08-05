import React from 'react'
import { ShoppingCart, Sparkles, ArrowRight } from 'lucide-react'

interface GlassCardProps {
  className?: string
}

export const GlassCard: React.FC<GlassCardProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main Glass Card */}
      <div className="glass-card group cursor-pointer">
        {/* Background Gradient */}
        <div className="glass-card-bg"></div>
        
        {/* Animated Background Orbs */}
        <div className="glass-orb-primary"></div>
        <div className="glass-orb-secondary"></div>
        
        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="glass-icon-container">
                <ShoppingCart className="w-6 h-6 glass-icon" />
              </div>
              <div>
                <h3 className="text-xl font-bold glass-text-primary">Premium Access</h3>
                <p className="glass-text-secondary text-sm">Unlock all features</p>
              </div>
            </div>
            <Sparkles className="w-6 h-6 glass-accent animate-pulse" />
          </div>

          {/* Marquee Container */}
          <div className="glass-marquee">
            <div className="marquee-container">
              <div className="marquee-content">
                <span className="glass-text-primary font-medium">🚀 Limited Time Offer • 50% OFF • Premium Features • Advanced Analytics • Priority Support • Exclusive Templates • </span>
                <span className="glass-text-primary font-medium">🚀 Limited Time Offer • 50% OFF • Premium Features • Advanced Analytics • Priority Support • Exclusive Templates • </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <div className="glass-feature-dot glass-feature-dot-1"></div>
              <span className="glass-text-secondary text-sm">Unlimited Projects</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="glass-feature-dot glass-feature-dot-2"></div>
              <span className="glass-text-secondary text-sm">Advanced Customization</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="glass-feature-dot glass-feature-dot-3"></div>
              <span className="glass-text-secondary text-sm">24/7 Priority Support</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="glass-button group/btn w-full">
            <div className="flex items-center justify-center space-x-2">
              <span className="glass-text-primary font-semibold">Upgrade Now</span>
              <ArrowRight className="w-4 h-4 glass-text-primary group-hover/btn:translate-x-1 transition-transform duration-300" />
            </div>
          </button>

          {/* Price */}
          <div className="text-center mt-4">
            <span className="glass-text-muted text-sm line-through">$99/month</span>
            <span className="glass-text-primary font-bold text-lg ml-2">$49/month</span>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="glass-hover-overlay"></div>
      </div>
    </div>
  )
}