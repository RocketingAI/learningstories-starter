// app/components/organization-switcher.tsx
'use client'

import { OrganizationSwitcher } from '@clerk/nextjs'
import { FileText } from 'lucide-react'
import { StoryTypesPage } from '~/components/story-types-page'

export function OrganizationSwitcherComponent() {
  return (
    <OrganizationSwitcher 
      organizationProfileMode="modal"
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
      <OrganizationSwitcher.OrganizationProfilePage
        label="Story Types"
        url="story-types"
        labelIcon={<FileText className="w-5 h-5" />}
      >
        <StoryTypesPage />
      </OrganizationSwitcher.OrganizationProfilePage>
    </OrganizationSwitcher>
  )
}