import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Bot, Target, Zap } from 'lucide-react'

const features = [
  {
    name: 'AI-Powered Insights',
    description: 'Get real-time, data-driven recommendations to optimize your sales strategy.',
    icon: Bot,
  },
  {
    name: 'Smart Lead Scoring',
    description: 'Automatically identify and prioritize your most promising leads.',
    icon: Target,
  },
  {
    name: 'Sales Automation',
    description: 'Automate repetitive tasks and focus on what matters most - closing deals.',
    icon: Zap,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">
          Key Features
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.name}>
              <CardHeader>
                <feature.icon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

