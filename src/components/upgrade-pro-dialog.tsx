import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSubscription } from "~/hooks/use-subscription";
import { toast } from "sonner";

const STRIPE_PRICE_ID_PRO_PLAN = "price_1QV0taDEcwpHlv4Jh8lH0436";
const STRIPE_PRICE_ID_TEAM_PLAN = "price_1QV0yQDEcwpHlv4JrXNiyVdU";
const STRIPE_PRICE_ID_ENTERPRISE_PLAN = "price_1QV1ScDEcwpHlv4JdvlPymLk";

interface UpgradeProDialogProps {
  children?: React.ReactNode;
}

const proFeatures = [
  "Unlimited AI Assistant Usage",
  "Advanced Template Customization",
  "Priority Support",
  "Custom Branding",
];

const teamFeatures = [
  ...proFeatures,
  "Team Collaboration",
  "Analytics Dashboard",
  "Advanced Permissions",
  "Shared Templates",
];

const enterpriseFeatures = [
  ...teamFeatures,
  "API Access",
  "Dedicated Account Manager",
  "Custom Integration Support",
  "SLA Guarantees",
];

export function UpgradeProDialog({ children }: UpgradeProDialogProps) {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { isSubscribed, isLoading: isSubscriptionLoading } = useSubscription();

  const handleUpgrade = async (priceId: string) => {
    try {
      setIsCheckoutLoading(true);
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (!data.url) {
        throw new Error("No checkout URL returned");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(error instanceof Error ? error.message : "Failed to start checkout process");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Don't render anything while checking subscription status
  if (isSubscriptionLoading) {
    return null;
  }

  // Don't render if user is subscribed
  if (isSubscribed) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button>Upgrade Plan</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Choose Your Plan
          </DialogTitle>
          <DialogDescription>
            Select the perfect plan for your business needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pro</span>
                <span className="text-3xl font-bold">$29</span>
              </CardTitle>
              <CardDescription>per month for 1 person</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleUpgrade(STRIPE_PRICE_ID_PRO_PLAN)}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "Loading..." : "Upgrade to Pro"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team</span>
                <span className="text-3xl font-bold">$149</span>
              </CardTitle>
              <CardDescription>per month for up to 5 people</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {teamFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleUpgrade(STRIPE_PRICE_ID_TEAM_PLAN)}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "Loading..." : "Upgrade to Team"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Enterprise</span>
                <span className="text-3xl font-bold">$299</span>
              </CardTitle>
              <CardDescription>per month for up to 15 people</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {enterpriseFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleUpgrade(STRIPE_PRICE_ID_ENTERPRISE_PLAN)}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "Loading..." : "Upgrade to Enterprise"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}