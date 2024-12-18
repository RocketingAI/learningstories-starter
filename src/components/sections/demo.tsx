'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export function DemoSection() {
  return (
    <section id="demo" className="py-20 sm:py-32">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            See DealClosers.ai in Action
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Watch how our AI-powered platform helps sales teams close more deals.
          </p>
        </motion.div>
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border bg-card shadow-lg aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

