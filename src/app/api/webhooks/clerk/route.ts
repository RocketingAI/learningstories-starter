import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

async function updateUserMetadata(userId: string, organizationId: string) {
  try {
    // Get the organization to check its metadata
    const organization = await clerkClient.organizations.getOrganization({
      organizationId: organizationId,
    });

    // Get the user's role in the organization
    const membership = await clerkClient.organizations.getOrganizationMembership({
      organizationId: organizationId,
      userId: userId,
    });

    // Get organization's metadata which should include plan details
    const orgMetadata = organization.publicMetadata as {
      subscriptionPlan?: 'team' | 'enterprise';
      teamSize?: number;
    };

    if (!orgMetadata.subscriptionPlan) {
      console.error('Organization is missing subscription plan metadata');
      return;
    }

    // Update user's metadata to reflect organization membership
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        subscriptionPlan: orgMetadata.subscriptionPlan,
        teamSize: orgMetadata.teamSize,
        organizationId: organizationId,
        organizationRole: membership.role,
      },
      privateMetadata: {
        role: 'paid_user',
        updatedAt: new Date().toISOString(),
      },
    });

    console.log('Successfully updated user metadata for organization member:', {
      userId,
      organizationId,
      plan: orgMetadata.subscriptionPlan,
      role: membership.role,
    });
  } catch (error) {
    console.error('Error updating user metadata:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const headersList = headers();
    const svixId = headersList.get("svix-id");
    const svixTimestamp = headersList.get("svix-timestamp");
    const svixSignature = headersList.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Error occured -- no svix headers", {
        status: 400,
      });
    }

    if (!webhookSecret) {
      return new NextResponse("Error occured -- no webhook secret", {
        status: 400,
      });
    }

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(
        JSON.stringify(payload),
        {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        }
      ) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new NextResponse('Error occured', {
        status: 400,
      });
    }

    const { type, data } = evt;
    console.log('Webhook received:', type);

    switch (type) {
      case 'organizationMembership.created':
        await updateUserMetadata(
          data.public_user_data.user_id,
          data.organization.id
        );
        break;

      case 'organizationMembership.updated':
        // Handle role updates
        await updateUserMetadata(
          data.public_user_data.user_id,
          data.organization.id
        );
        break;

      case 'organizationMembership.deleted':
        // Reset user to free plan when they leave organization
        await clerkClient.users.updateUser(data.public_user_data.user_id, {
          publicMetadata: {
            subscriptionPlan: 'free',
            teamSize: 1,
            organizationId: null,
            organizationRole: null,
          },
          privateMetadata: {
            role: 'free_user',
            updatedAt: new Date().toISOString(),
          },
        });
        break;
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Error occurred', { status: 500 });
  }
}
