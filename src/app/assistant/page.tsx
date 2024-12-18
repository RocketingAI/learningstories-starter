import { Bot, Command, Sparkles } from "lucide-react";
import Assistant from "~/components/assistant/assistant";
import { JsonDisplay } from "~/components/assistant/json-display";
import { AppSidebar } from "~/components/sidebar/sidebar";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

import { companyAssistantConfig } from "~/components/assistant/configs/company-assistant";
import { productAssistantConfig } from "~/components/assistant/configs/product-assistant";
import { jsonExtractionAssistantConfig } from "~/components/assistant/configs/json-extraction-assistant";
import { MessagesProvider } from "~/components/assistant/context/messages-context";

export default function Home() {
  return (
    <MessagesProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen flex-col overflow-hidden">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/95 px-6 dark:bg-background/50">
              <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-6" />
                <div className="flex space-x-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden lg:inline">AI Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs"><Command className="h-3 w-3" /></span>K
                </kbd>
              </div>
            </header>

            <main className="flex-1 overflow-hidden p-6">
              <div className="flex gap-6 h-[calc(100vh-120px)]">
                {/* Company Assistant */}
                <div className="w-[37.5%] rounded-xl bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 transition-all duration-300 ease-in-out overflow-hidden shadow-lg hover:shadow-xl opacity-90">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />
                    <Assistant config={companyAssistantConfig} />
                  </div>
                </div>

                {/* Product Assistant */}
                <div className="w-[37.5%] rounded-xl bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 dark:from-emerald-500/20 dark:via-teal-500/20 dark:to-cyan-500/20 transition-all duration-300 ease-in-out overflow-hidden shadow-lg hover:shadow-xl opacity-90">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />
                    <Assistant config={productAssistantConfig} />
                  </div>
                </div>

                {/* JSON Extraction Assistant */}
                <div className="w-[25%] rounded-xl bg-gradient-to-br from-slate-500/30 via-zinc-500/30 to-stone-500/30 dark:from-slate-500/20 dark:via-zinc-500/20 dark:to-stone-500/20 transition-all duration-300 ease-in-out overflow-hidden shadow-lg hover:shadow-xl opacity-90">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />
                    <JsonDisplay config={jsonExtractionAssistantConfig} />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </MessagesProvider>
  );
}
