"use client";

import * as React from "react"

import { Logo } from "~/components/sidebar/logo"

import { BadgeCheck, CodeXml, Bell, Blocks, BookOpen, Bot, ChevronRight, ChevronsUpDown, CircleDollarSign, Command, CreditCard, File, FileText, Folder, Frame, LifeBuoy, LogIn, LogOut, Map, MessageCircle, MoreHorizontal, Pencil, PieChart, Send, Settings2, Share, FileSearch, Sparkles, SquareTerminal, Trash2, Archive 
} from "lucide-react" 
import {
Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarFooter,
  SidebarHeader,
} from "~/components/ui/sidebar"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import { 
  Separator 
} from "~/components/ui/separator"

import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Link from "next/link";

import { SettingsSheet } from "~/components/settings-sheet"
import { FeedbackSheet } from "~/components/feedback-sheet"
import { SupportSheet } from "~/components/support-sheet"
import { UpgradeProDialog } from "~/components/upgrade-pro-dialog"
import FolderTree from "./sidebar-folders"

import { useSubscription } from "~/hooks/use-subscription";

type TreeItem = string | [string, ...any[]];

interface FlatItem {
  id: string;
  content: string;
  children: FlatItem[];
  parentId: string | null;
  isExpanded: boolean;
}

function flattenTree(items: TreeItem[], parentId: string | null = null): FlatItem[] {
  return items.flatMap((item): FlatItem[] => {
    const [name, ...children] = Array.isArray(item) ? item : [item];
    const id = `${parentId ? `${parentId}-` : ''}${name}`;
    const flatItem: FlatItem = {
      id,
      content: name,
      children: [],
      parentId,
      isExpanded: true
    };

    if (children.length > 0) {
      flatItem.children = flattenTree(children, id);
    }

    return [flatItem, ...flatItem.children];
  });
}

function rebuildTree(items: FlatItem[]): TreeItem[] {
  const itemMap = new Map<string, FlatItem>();
  const rootItems: FlatItem[] = [];

  // First pass: create a map of all items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: rebuild the tree structure
  items.forEach(item => {
    const currentItem = itemMap.get(item.id)!;
    if (item.parentId === null) {
      rootItems.push(currentItem);
    } else {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(currentItem);
      }
    }
  });

  // Convert back to the original format
  function convertToTreeItem(item: FlatItem): TreeItem {
    if (item.children.length === 0) {
      return item.content;
    }
    return [item.content, ...item.children.map(convertToTreeItem)];
  }

  return rootItems.map(convertToTreeItem);
}

// This is sample data.
const data = {
  navMain: [
    {
      title: "AI Assistant",
      url: "/assistant",
      icon: MessageCircle,
    },
    {
      title: "OpenAI",
      url: "/examples/all",
      icon: MessageCircle,
    },
    {
      title: "Editor",
      url: "/editor",
      icon: Pencil,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: Blocks,
    },
    {
      title: "Function calling",
      url: "/examples/function-calling",
      icon: Bot,
    },
    {
      title: "File search",
      url: "/examples/file-search",
      icon: FileSearch,
    },
    {
      title: "Playground",
      url: "/testpage3",
      icon: CodeXml,
    },
    {
      title: "Document Generator",
      url: "/testpage4",
      icon: CodeXml,
    },
    {
      title: "Function Calling",
      url: "/function-calling",
      icon: CodeXml,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      component: SettingsSheet,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
      component: SupportSheet,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
      component: FeedbackSheet,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const { planName, isSubscribed, isLoading } = useSubscription();

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

  };

  return (
    <Sidebar {...props}>
      
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">

                <Logo />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Deal Closers</span>
                  <span className="truncate text-xs flex items-center gap-1">
                    {isLoading ? (
                      <span className="text-muted-foreground">Loading...</span>
                    ) : (
                      <>
                        {planName}
                        {isSubscribed && <BadgeCheck className="h-3 w-3 text-green-500" />}
                      </>
                    )}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>

        <SidebarGroup>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible key={item.title} asChild >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <FolderTree />
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.component ? (
                    <item.component>
                      <SidebarMenuButton asChild size="sm">
                        <button type="button">
                          <item.icon />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </item.component>
                  ) : (
                    <SidebarMenuButton asChild size="sm">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {isSignedIn ? (
                    <>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.fullName} />
                        <AvatarFallback className="rounded-lg">{user?.firstName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.fullName}</span>
                        <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
                      </div>
                    </>
                  ) : (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Guest</span>
                      <span className="truncate text-xs">Not Signed In</span>
                    </div>
                  )}
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.fullName} />
                      <AvatarFallback className="rounded-lg">{user?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.fullName}</span>
                      <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
    
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {isSignedIn ? (
                  <DropdownMenuItem onClick={() => window.location.href = '/logout'}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => window.location.href = '/sign-in'}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {!isLoading && !isSubscribed && (
            <SidebarMenuItem>
              <UpgradeProDialog>
                <div className="flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-2 text-white transition-colors hover:from-pink-600 hover:to-purple-600 cursor-pointer">
                  <div className="flex size-5 items-center justify-center">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm font-semibold leading-tight">
                    Upgrade to Pro
                  </div>
                </div>
              </UpgradeProDialog>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

interface FileTreeItemProps {
  item: FlatItem;
  onToggle: () => void;
}

function FileTreeItem({ item, onToggle }: FileTreeItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.content);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasChildren = item.children.length > 0;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setEditedName(item.content);
      setIsEditing(false);
    }
  };

  return (
    <div className="group px-2 py-1">
      <div className="flex items-center gap-2">
        {hasChildren ? (
          <button
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                item.isExpanded ? 'rotate-90' : ''
              }`}
            />
          </button>
        ) : (
          <div className="w-4" />
        )}
        {hasChildren ? (
          <Folder className="h-4 w-4 text-muted-foreground" />
        ) : (
          <File className="h-4 w-4 text-muted-foreground" />
        )}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
          />
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            className="flex-1 cursor-default truncate"
          >
            {editedName}
          </span>
        )}
      </div>
    </div>
  );
}
