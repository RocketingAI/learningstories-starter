'use client';

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from 'react';
import { AppSidebar } from "~/components/sidebar/sidebar"
import { Separator } from "~/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import Link from "next/link";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    OpenAI Examples
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/examples/function-calling" className="p-4 border rounded-lg hover:bg-gray-50">
              <h2 className="text-xl font-semibold">Function Calling</h2>
              <p className="text-gray-600">Example of OpenAI function calling with weather data</p>
            </Link>
            <Link href="/examples/file-search" className="p-4 border rounded-lg hover:bg-gray-50">
              <h2 className="text-xl font-semibold">File Search</h2>
              <p className="text-gray-600">Example of file search and chat functionality</p>
            </Link>
            <Link href="/examples/all" className="p-4 border rounded-lg hover:bg-gray-50">
              <h2 className="text-xl font-semibold">All Features</h2>
              <p className="text-gray-600">Example combining all OpenAI features</p>
            </Link>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}