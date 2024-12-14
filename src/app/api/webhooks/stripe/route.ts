// src/app/api/webhooks/stripe/route.ts
import { clerkClient } from "@clerk/nextjs";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Handling subscription update:', {
    id: subscription.id,
    status: subscription.status,
    metadata: subscription.metadata
  });
  
  try {
    if (!subscription.metadata?.userId) {
      console.error('No userId in subscription metadata:', subscription.id);
      return;
    }

    const userId = subscription.metadata.userId;
    const organizationId = subscription.metadata.organizationId;
    const planName = subscription.metadata.planName || 'pro';
    const teamSize = parseInt(subscription.metadata.teamSize || '1', 10);
    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    
    console.log('Updating subscription for:', { userId, organizationId });

    // Get the user to access current metadata
    const user = await clerkClient.users.getUser(userId);
    console.log('Found Clerk user:', user.id);

    if (organizationId) {
      // This is an organization subscription
      const organization = await clerkClient.organizations.getOrganization({ organizationId });
      
      // Update organization metadata
      await clerkClient.organizations.updateOrganization(organizationId, {
        publicMetadata: {
          ...organization.publicMetadata,
          stripeCustomerId: subscription.customer as string,
        },
      });

      // Update user's organization subscription metadata
      const currentSubscriptions = user.privateMetadata.organizationSubscriptions || [];
      const updatedSubscriptions = currentSubscriptions.map(sub => 
        sub.orgId === organizationId 
          ? {
              ...sub,
              subscriptionPlan: isActive ? planName : 'free',
              subscriptionStatus: subscription.status,
              teamSize: isActive ? teamSize : 1,
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: subscription.customer as string,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              subscriptionStartDate: subscription.start_date 
                ? new Date(subscription.start_date * 1000).toISOString()
                : null,
            }
          : sub
      );

      await clerkClient.users.updateUser(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          organizationSubscriptions: updatedSubscriptions,
          role: isActive ? 'paid_user' : 'free_user',
          updatedAt: new Date().toISOString(),
        }
      });

      console.log('Updated organization subscription metadata:', {
        organizationId,
        status: subscription.status,
        plan: planName
      });
    } else {
      // This is an individual subscription
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000)
            : null,
          subscriptionStatus: subscription.status,
          subscriptionPlan: isActive ? planName : 'free',
          teamSize: isActive ? teamSize : 1,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          subscriptionStartDate: subscription.start_date 
            ? new Date(subscription.start_date * 1000)
            : null,
        },
        privateMetadata: {
          role: isActive ? 'paid_user' : 'free_user',
          updatedAt: new Date().toISOString(),
        },
      });

      console.log('Updated individual subscription metadata:', {
        userId,
        status: subscription.status,
        plan: planName
      });
    }
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error);
    throw error;
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout completion:', session.id);
  
  try {
    if (!session?.metadata?.userId) {
      console.error('No userId in session metadata:', session.id);
      return;
    }

    console.log('Found userId in session:', session.metadata.userId);

    if (!session.subscription) {
      console.error('No subscription in session:', session.id);
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    console.log('Retrieved subscription:', subscription.id);

    // Update subscription metadata with session metadata
    const metadata = {
      userId: session.metadata.userId,
      organizationId: session.metadata.organizationId,
      planName: session.metadata.planName,
      teamSize: session.metadata.teamSize,
    };

    console.log('Updating subscription metadata:', metadata);
    
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      metadata
    });

    await handleSubscriptionUpdated(updatedSubscription);
  } catch (error) {
    console.error('Error in handleCheckoutCompleted:', error);
    throw error;
  }
}

async function updateSubscriptionMetadata(
  subscription: Stripe.Subscription,
  status: string
) {
  const userId = subscription.metadata.userId;
  const organizationId = subscription.metadata.organizationId;
  if (!userId) {
    console.error("No userId found in subscription metadata");
    return;
  }

  const plan = subscription.metadata.planName;
  const teamSize = parseInt(subscription.metadata.teamSize || "1");
  const isActive = status === 'active' || status === 'trialing';

  try {
    if (organizationId) {
      // Find organization by Stripe customer ID
      const organizations = await clerkClient.organizations.getOrganizationList({
        query: subscription.customer as string,
      });

      const organization = organizations.find(
        (org) => org.publicMetadata.stripeCustomerId === subscription.customer
      );

      if (organization) {
        // Update organization metadata
        await clerkClient.organizations.updateOrganization(organization.id, {
          publicMetadata: {
            ...organization.publicMetadata,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: subscription.current_period_end 
              ? new Date(subscription.current_period_end * 1000)
              : null,
            subscriptionStatus: status,
            subscriptionPlan: isActive ? plan : 'free',
            teamSize: isActive ? teamSize : 1,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            subscriptionStartDate: subscription.start_date 
              ? new Date(subscription.start_date * 1000)
              : null,
          },
        });

        console.log('Updated organization metadata:', {
          organizationId: organization.id,
          plan,
          status,
          teamSize
        });
      } else {
        // Update user metadata if no organization found
        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: subscription.current_period_end 
              ? new Date(subscription.current_period_end * 1000)
              : null,
            subscriptionStatus: status,
            subscriptionPlan: isActive ? plan : 'free',
            teamSize: isActive ? teamSize : 1,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        console.log('Updated user metadata:', {
          userId,
          plan,
          status,
          teamSize
        });
      }
    } else {
      // Update user metadata
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000)
            : null,
          subscriptionStatus: status,
          subscriptionPlan: isActive ? plan : 'free',
          teamSize: isActive ? teamSize : 1,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          subscriptionStartDate: subscription.start_date 
            ? new Date(subscription.start_date * 1000)
            : null,
        },
      });

      console.log('Updated user metadata:', {
        userId,
        plan,
        status,
        teamSize
      });
    }
  } catch (error) {
    console.error("Error updating metadata:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  console.log('Webhook POST received');
  
  try {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature");

    console.log('Webhook signature:', signature);

    if (!signature) {
      return new NextResponse("No signature in request", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Constructed event:', event.type, event.id);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse(
        JSON.stringify({ error: "Webhook signature verification failed" }), 
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed":
        console.log('Processing checkout.session.completed');
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await handleSubscriptionUpdated(subscription);
        }
        break;

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice;
        if (failedInvoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(failedInvoice.subscription as string);
          await handleSubscriptionUpdated(subscription);
        }
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        console.log(`Processing ${event.type}`);
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Return a 500 error with the actual error message
    return new NextResponse(
      JSON.stringify({ 
        error: "Webhook handler failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      }),
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};