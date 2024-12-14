import { AppSidebar } from "~/components/sidebar/sidebar";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Save, Plus, Settings, Eye } from "lucide-react";

export default function CreateTemplatePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/templates">Templates</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Template</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </div>
        </header>

        <div className="grid h-[calc(100vh-4rem)] grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-4 p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input id="name" placeholder="Enter template name..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Enter template description..." />
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Sections</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>
                <div className="mt-4 space-y-4">
                  {/* Section placeholders */}
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Cover Page</h4>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Executive Summary</h4>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Pricing Table</h4>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-l">
            <Tabs defaultValue="settings" className="h-full">
              <TabsList className="w-full justify-start rounded-none border-b">
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="settings" className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Page Size</Label>
                    <select className="w-full rounded-md border bg-transparent px-3 py-2">
                      <option>A4</option>
                      <option>Letter</option>
                      <option>Legal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Orientation</Label>
                    <select className="w-full rounded-md border bg-transparent px-3 py-2">
                      <option>Portrait</option>
                      <option>Landscape</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <select className="w-full rounded-md border bg-transparent px-3 py-2">
                      <option>Inter</option>
                      <option>Arial</option>
                      <option>Times New Roman</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <select className="w-full rounded-md border bg-transparent px-3 py-2">
                      <option>10pt</option>
                      <option>11pt</option>
                      <option>12pt</option>
                      <option>14pt</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Line Height</Label>
                    <select className="w-full rounded-md border bg-transparent px-3 py-2">
                      <option>1.0</option>
                      <option>1.15</option>
                      <option>1.5</option>
                      <option>2.0</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
