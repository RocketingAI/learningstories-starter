import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import { AppSidebar } from "~/components/sidebar/sidebar";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { ChatInterface } from "~/components/chat/chat-interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Podcast } from "lucide-react";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">ui</BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 text-center">
                    <CardContent className="flex flex-col items-center space-y-4 pt-6">
                      <Podcast className="h-12 w-12 text-muted-foreground/60" />
                      <h3 className="font-semibold">Company Information</h3>
                      <p className="text-sm text-muted-foreground">No company context available</p>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Add Company
                      </button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 text-center">
                    <CardContent className="flex flex-col items-center space-y-4 pt-6">
                      <Podcast className="h-12 w-12 text-muted-foreground/60" />
                      <h3 className="font-semibold">Customer Information</h3>
                      <p className="text-sm text-muted-foreground">No customer context available</p>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Add Customer
                      </button>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 text-center">
                    <CardContent className="flex flex-col items-center space-y-4 pt-6">
                      <Podcast className="h-12 w-12 text-muted-foreground/60" />
                      <h3 className="font-semibold">Product Lines</h3>
                      <p className="text-sm text-muted-foreground">No product lines available</p>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Add Products
                      </button>
                    </CardContent>
                  </Card>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
              </div>
            </SidebarInset>
          </SidebarProvider>
    </HydrateClient>
  );
}
