import Link from "next/link";

import { AppSidebar } from "~/components/sidebar/sidebar";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { InteractiveContainers } from "~/components/interactive-containers";
import { Bot, Sparkles, Command } from "lucide-react";
import { ContextButtonDataArray } from '~/components/context-button/context-button-data';
import { ContextButton } from '~/components/context-button/context-button';

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-gradient-to-b from-background to-background/95">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-muted/20 px-6 backdrop-blur-sm">
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
                
                <div className=" mt-1">
                  {ContextButtonDataArray.map((layer) => (
                    <ContextButton 
                      key={layer.type}
                      type={layer.type}
                      percentage={layer.percentage}
                      title={layer.title}
                      description={layer.description}
                      color={layer.color}
                    />
                  ))}
                </div>

                <div className="flex-1 relative rounded-xl border border-muted/20 backdrop-blur-xl overflow-hidden">

                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-primary/0 to-primary/5" />
                  <InteractiveContainers />
                </div>

              </div>
            </div>
          </main>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}