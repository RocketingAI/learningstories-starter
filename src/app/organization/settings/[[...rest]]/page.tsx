'use client'

import { OrganizationProfile } from '@clerk/nextjs'
import { FileText, CreditCard } from 'lucide-react'
import { StoryTypesPage } from '~/components/story-types-page'
import { SubscriptionPage } from '~/components/subscription-page'
import { useAuth, useOrganization } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OrganizationSettingsPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const { organization, isLoaded: orgIsLoaded } = useOrganization()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn || !orgIsLoaded) {
    return <div className="min-h-screen bg-black p-8">Loading...</div>
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        <h1 className="text-xl font-semibold mb-4">No Organization Selected</h1>
        <p className="text-zinc-400 mb-4">Please select or create an organization to continue.</p>
        <button 
          onClick={() => router.push('/organizations/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Organization
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <OrganizationProfile
        routing="hash"
        appearance={{
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#09090b',
            colorText: '#ffffff',
            colorTextSecondary: '#a1a1aa',
            colorInputBackground: '#18181b',
            colorInputText: '#ffffff',
            colorNeutral: '#27272a',
            colorSuccess: '#22c55e',
            colorDanger: '#ef4444',
            colorWarning: '#f59e0b',
            borderRadius: '0.5rem',
            fontFamily: 'inherit'
          },
          elements: {
            card: 'border-zinc-800 bg-zinc-950',
            navbar: 'bg-zinc-900 border-zinc-800',
            button: 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800',
            buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
            formFieldInput: 'bg-zinc-900 border-zinc-800 text-white',
            formFieldLabel: 'text-zinc-400',
            headerTitle: 'text-2xl font-bold text-white',
            headerSubtitle: 'text-sm text-zinc-400'
          }
        }}
      >
        <OrganizationProfile.Page
          label="Story Types"
          url="story-types"
          labelIcon={<FileText className="w-5 h-5" />}
        >
          <StoryTypesPage />
        </OrganizationProfile.Page>
        <OrganizationProfile.Page
          label="Subscription"
          url="subscription"
          labelIcon={<CreditCard className="w-5 h-5" />}
        >
          <SubscriptionPage />
        </OrganizationProfile.Page>
      </OrganizationProfile>
    </div>
  )
}
