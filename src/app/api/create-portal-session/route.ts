import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(req: Request) {
  try {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get the organization's Stripe customer ID from your database
    // This is just an example - replace with your actual database query
    const stripeCustomerId = 'cus_xxx' // TODO: Get this from your database

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${req.headers.get('origin')}/organization/settings#/subscription`,
      configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
