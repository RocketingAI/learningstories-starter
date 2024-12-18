"use client";

import { Inter } from 'next/font/google'
import { AppSidebar } from "~/components/sidebar/sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { Bot, Sparkles } from "lucide-react";
import { ThemeProvider } from "~/components/test-6/test-component-6/theme-provider"
import { InteractiveContainers2 } from "~/components/test-6/test-component-6/interactive-containers-2"
import "~/styles/globals.css";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-col h-screen bg-gradient-to-b from-background to-background/95">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-muted/20 px-6">
                <div className="flex items-center gap-2 transition-transform hover:scale-[0.98]">
                  <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground transition-colors" />
                  <Separator orientation="vertical" className="h-4 bg-muted/50" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center pl-[var(--sidebar-collapsed-padding,0px)]">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-sm font-semibold">AI Assistant</h1>
                      <p className="text-xs text-muted-foreground">Document Generation</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Pro</span>
                    </div>
                  </div>
                </div>
              </header>

              <main className="flex-1 overflow-hidden">
                <div className="h-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
                  <div className="relative h-full flex gap-4">
                    <InteractiveContainers2 />
                  </div>
                </div>
              </main>
            </div>

          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}
