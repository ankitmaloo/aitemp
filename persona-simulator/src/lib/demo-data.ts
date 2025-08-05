export interface DemoCardData {
  id: string
  title: string
  description: string
  iconType: 'brain' | 'sparkles' | 'target'
  className: string
}

export const demoCardsData: DemoCardData[] = [
  {
    id: 'neumorphic',
    title: 'Neumorphic Design',
    description: 'Soft, extruded interfaces with subtle shadows',
    iconType: 'brain',
    className: 'neumorphic bg-gray-50 dark:bg-gray-800'
  },
  {
    id: 'glass',
    title: 'Glassmorphism',
    description: 'Frosted glass effect with backdrop blur',
    iconType: 'sparkles',
    className: 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
  },
  {
    id: 'clay',
    title: 'Claymorphism',
    description: 'Clay-like textures with soft gradients',
    iconType: 'target',
    className: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600'
  }
]

export const featureCards = [
  {
    id: 'responsive',
    title: 'Responsive Design',
    description: 'Adapts seamlessly across all device sizes',
    className: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
    titleColor: 'text-blue-900 dark:text-blue-100',
    descriptionColor: 'text-blue-700 dark:text-blue-300',
    features: [
      { color: 'bg-green-500', label: 'Mobile Optimized', textColor: 'text-blue-800 dark:text-blue-200' },
      { color: 'bg-blue-500', label: 'Tablet Ready', textColor: 'text-blue-800 dark:text-blue-200' },
      { color: 'bg-purple-500', label: 'Desktop Enhanced', textColor: 'text-blue-800 dark:text-blue-200' }
    ]
  },
  {
    id: 'accessibility',
    title: 'Accessibility First',
    description: 'Built with WCAG guidelines and keyboard navigation',
    className: 'neumorphic',
    titleColor: 'text-gray-900 dark:text-gray-100',
    descriptionColor: 'text-gray-600 dark:text-gray-400',
    features: [
      { color: 'bg-green-500', label: 'High Contrast Support', textColor: 'text-gray-800 dark:text-gray-200' },
      { color: 'bg-blue-500', label: 'Screen Reader Compatible', textColor: 'text-gray-800 dark:text-gray-200' },
      { color: 'bg-purple-500', label: 'Keyboard Navigation', textColor: 'text-gray-800 dark:text-gray-200' }
    ]
  }
]