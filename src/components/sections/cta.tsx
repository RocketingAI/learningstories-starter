'use client'

import { Button } from '../ui/button'

interface CTASectionProps {
  onStartFreeTrial: () => void;
}

export function CTASection({ onStartFreeTrial }: CTASectionProps) {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">
            Ready to Boost Your Sales?
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-muted-foreground mb-8">
            Start your free 14-day trial today. No credit card required.
          </p>
          <Button size="lg" onClick={onStartFreeTrial}>
            Start Free Trial
          </Button>
        </div>
      </div>
    </section>
  )
}

