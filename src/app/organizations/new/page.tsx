"use client";

import { OrganizationProfile } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function NewOrganizationPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const plan = searchParams.get("plan");

  // If user arrived here without completing checkout, redirect to home
  if (!success || !plan || (plan !== "team" && plan !== "enterprise")) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Your Organization</h1>
        <p className="text-muted-foreground mb-8">
          {plan === "team" 
            ? "Set up your team workspace to collaborate with up to 5 members"
            : "Set up your enterprise workspace to collaborate with up to 15 members"}
        </p>
        <OrganizationProfile 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full",
            },
          }}
        />
      </div>
    </div>
  );
}
