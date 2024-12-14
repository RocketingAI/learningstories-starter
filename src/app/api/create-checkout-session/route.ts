import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse, Request } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";

// Initialize Stripe with proper error handling
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

const PLAN_DETAILS = {
  'price_1QV0taDEcwpHlv4Jh8lH0436': { name: 'pro', teamSize: 1 },
  'price_1QV0yQDEcwpHlv4JrXNiyVdU': { name: 'team', teamSize: 5 },
  'price_1QV1ScDEcwpHlv4JdvlPymLk': { name: 'enterprise', teamSize: 15 }
} as const;

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await req.json();
    const { priceId } = body as { priceId: keyof typeof PLAN_DETAILS };

    if (!priceId || !PLAN_DETAILS[priceId as keyof typeof PLAN_DETAILS]) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid price ID" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const planDetails = PLAN_DETAILS[priceId as keyof typeof PLAN_DETAILS];
    
    const email = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      return new NextResponse(
        JSON.stringify({ error: "No email found" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create or get customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: {
          userId: user.id,
        },
      });
    }

    // Prepare base metadata
    const baseMetadata = {
      userId: user.id,
      planName: planDetails.name,
      teamSize: planDetails.teamSize.toString(),
    };

    // For team and enterprise plans, create an organization first
    if (planDetails.name === 'team' || planDetails.name === 'enterprise') {
      try {
        const organization = await clerkClient.organizations.createOrganization({
          name: `${user.firstName || user.username}'s Organization`,
          createdBy: user.id,
          publicMetadata: {
            stripeCustomerId: customer.id,
          },
        });

        // Update user's private metadata
        await clerkClient.users.updateUser(user.id, {
          privateMetadata: {
            ...user.privateMetadata,
            organizationSubscriptions: [
              ...(user.privateMetadata.organizationSubscriptions || []),
              {
                orgId: organization.id,
                subscriptionPlan: planDetails.name,
                subscriptionStatus: 'pending',
                teamSize: planDetails.teamSize,
                stripeCustomerId: customer.id,
                stripeSubscriptionId: null, // Will be updated in webhook
              }
            ]
          }
        });

        // Create checkout session with organization metadata
        const sessionWithOrg = await stripe.checkout.sessions.create({
          customer: customer.id,
          line_items: [{ price: priceId, quantity: 1 }],
          mode: "subscription",
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
          metadata: { ...baseMetadata, organizationId: organization.id },
          subscription_data: {
            metadata: { ...baseMetadata, organizationId: organization.id },
          },
        });

        return NextResponse.json({ url: sessionWithOrg.url });
      } catch (error) {
        console.error('Error creating organization:', error);
        return new NextResponse(
          JSON.stringify({ error: "Error creating organization" }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Create checkout session without organization metadata
    const sessionWithoutOrg = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: baseMetadata,
      subscription_data: {
        metadata: baseMetadata,
      },
    });

    return NextResponse.json({ url: sessionWithoutOrg.url });
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error"
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
