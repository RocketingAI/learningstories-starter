import { useUser, useOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type SubscriptionPlan = 'pro' | 'team' | 'enterprise';
type UserStatus = 'Guest' | SubscriptionPlan;

interface SubscriptionData {
  planName: UserStatus;
  isSubscribed: boolean;
  isLoading: boolean;
  teamSize?: number;
  organizationRole?: string;
  isOrgAdmin?: boolean;
}

interface OrganizationSubscription {
  orgId: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: string;
  teamSize?: number;
}

export function useSubscription(): SubscriptionData {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, membership, isLoaded: isOrgLoaded } = useOrganization();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    planName: 'Guest',
    isSubscribed: false,
    isLoading: true,
    teamSize: 1
  });

  useEffect(() => {
    const determineSubscriptionStatus = async () => {
      // If user is not loaded yet, keep loading state
      if (!isUserLoaded || !isOrgLoaded) {
        setSubscriptionData(prev => ({ ...prev, isLoading: true }));
        return;
      }

      // If no user, they are a Guest
      if (!user) {
        setSubscriptionData({
          planName: 'Guest',
          isSubscribed: false,
          isLoading: false,
          teamSize: 1
        });
        return;
      }

      try {
        // First check organization membership
        if (organization && membership) {
          // Get all members and find the admin
          const members = await organization.getMemberships();
          const adminMember = members.find(m => m.role === 'admin');

          if (adminMember) {
            // Get admin's private metadata
            const adminUser = await adminMember.user;
            const adminMetadata = adminUser.privateMetadata as {
              organizationSubscriptions?: OrganizationSubscription[];
            };

            // Find subscription for this specific organization
            const orgSubscription = adminMetadata.organizationSubscriptions?.find(
              sub => sub.orgId === organization.id
            );

            // Check if admin has an active subscription for this organization
            const hasActiveSubscription = 
              orgSubscription?.subscriptionPlan && 
              orgSubscription.subscriptionStatus === 'active';

            if (hasActiveSubscription && orgSubscription) {
              setSubscriptionData({
                planName: orgSubscription.subscriptionPlan,
                isSubscribed: true,
                isLoading: false,
                teamSize: orgSubscription.teamSize || 1,
                organizationRole: membership.role,
                isOrgAdmin: membership.role === 'admin'
              });
              return;
            }
          }
        }

        // If no active org subscription, check individual subscription
        const userMetadata = user?.privateMetadata as {
          subscriptionPlan?: SubscriptionPlan;
          subscriptionStatus?: string;
          teamSize?: number;
        };

        const hasActiveSubscription = 
          userMetadata?.subscriptionPlan && 
          userMetadata.subscriptionStatus === 'active';

        // Set subscription data based on individual status
        setSubscriptionData({
          planName: hasActiveSubscription ? userMetadata.subscriptionPlan! : 'Guest',
          isSubscribed: Boolean(hasActiveSubscription),
          isLoading: false,
          teamSize: userMetadata?.teamSize || 1,
          organizationRole: membership?.role,
          isOrgAdmin: membership?.role === 'admin'
        });

      } catch (error) {
        console.error('Error checking subscription status:', error);
        // Set Guest status on error
        setSubscriptionData({
          planName: 'Guest',
          isSubscribed: false,
          isLoading: false,
          teamSize: 1,
          organizationRole: membership?.role,
          isOrgAdmin: membership?.role === 'admin'
        });
      }
    };

    determineSubscriptionStatus();
  }, [user, isUserLoaded, organization, membership, isOrgLoaded]);

  return subscriptionData;
}