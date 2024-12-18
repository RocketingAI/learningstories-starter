'use client'

import { Button } from '../ui/button'

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="py-20 text-center">
      <div className="container px-4 md:px-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Close More Deals with AI-Powered Insights
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
          Transform your sales process with advanced AI technology. Get real-time insights and close deals faster.
        </p>
        <div className="mt-8">
          <Button size="lg" onClick={onGetStarted}>
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  )
}

