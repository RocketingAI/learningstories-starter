'use client';

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from 'react';
import styles from "~/styles/openai-page.module.css";
import { AppSidebar } from "~/components/sidebar/sidebar";
import { Separator } from "~/components/ui/separator";
import Chat from "~/components/openai-components/chat";
import FileViewer from "~/components/openai-components/file-viewer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "~/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

export default function Page() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }
  
  if (!isSignedIn) {
    return redirect("/sign-in");
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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/examples">Examples</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">File Search</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className={styles.openaiMain}>
          <div className={styles.openaiContainer}>
            <div className={styles.openaiColumn}>
              <FileViewer />
            </div>
            <div className={styles.openaiChatContainer}>
              <div className={styles.openaiChat}>
                <Chat />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
