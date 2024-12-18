'use client'

import { useState } from 'react'
import { HeroSection } from './sections/hero'
import { FeaturesSection } from './sections/features'
import { ValuePropositionSection } from './sections/value-proposition'
import { SocialProofSection } from './sections/social-proof'
import { CTASection } from './sections/cta'

export function DealClosersLanding() {
  const [showModal, setShowModal] = useState(false)

  const handleGetStarted = () => {
    setShowModal(true)
  }

  const handleStartFreeTrial = () => {
    setShowModal(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1">
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <ValuePropositionSection />
        <SocialProofSection />
        <CTASection onStartFreeTrial={handleStartFreeTrial} />
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Get Started</h2>
            <p>Thank you for your interest! Our team will contact you shortly.</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

