import { MessageCircle } from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon?: any
  children?: NavItem[]
}

export interface NavigationConfig {
  navMain: NavItem[]
}

export const navigationConfig: NavigationConfig = {
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
    }
  ]
}
