"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  Settings2Icon,
  CircleHelpIcon,
  TrendingUpIcon,
  FileChartColumnIcon,
  BellIcon,
  ZapIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Admin User",
    email: "admin@saasapp.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Analytics",
      url: "#",
      icon: <ChartBarIcon />,
    },
    {
      title: "Users",
      url: "#",
      icon: <UsersIcon />,
    },
    {
      title: "Revenue",
      url: "#",
      icon: <TrendingUpIcon />,
    },
    {
      title: "Subscriptions",
      url: "#",
      icon: <CreditCardIcon />,
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Notifications",
      url: "#",
      icon: <BellIcon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
  documents: [
    {
      name: "Reports",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Integrations",
      url: "#",
      icon: <ZapIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <ZapIcon className="size-5!" />
              <span className="text-base font-semibold">SaaS Analytics</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
