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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { FileText, Star, Clock, Plus } from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Sales Proposal 1",
      description: "Comprehensive template for sales proposals",
      category: "Sales",
      popularity: "Most Used",
      icon: Star,
    },
    {
      id: 2,
      name: "Sales Proposal 2",
      description: "Comprehensive template for sales proposals",
      category: "Sales",
      popularity: "Most Used",
      icon: Star,
    },
    {
      id: 3,
      name: "Quotation",
      description: "Template for quotations",
      category: "Sales",
      popularity: "Recent",
      icon: Clock,
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Sales Assistants</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Templates</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex-1" />
            <Button asChild>
              <Link href="/templates/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <template.icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>{template.name}</CardTitle>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="flex flex-1 flex-col space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{template.category}</span>
                      <span>{template.popularity}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/templates/${template.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button>Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
