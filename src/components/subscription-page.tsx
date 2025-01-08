'use client'

import { useOrganization } from '@clerk/nextjs'
import { CreditCard, Calendar, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from '~/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SubscriptionPage() {
  const { organization } = useOrganization()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Subscription Management
          </CardTitle>
          <CardDescription>Manage your subscription, payment methods, and billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-zinc-400">
              Click below to access your subscription management portal where you can:
            </p>
            <ul className="list-disc list-inside text-zinc-400 space-y-2">
              <li>View and update your subscription plan</li>
              <li>Update payment methods</li>
              <li>View billing history and download invoices</li>
              <li>Update tax information</li>
            </ul>
            <Button 
              onClick={handleManageSubscription} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? 'Loading...' : 'Manage Subscription'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
