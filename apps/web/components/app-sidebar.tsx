'use client';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  IconBinaryTree,
  IconCurrencyDollar,
  IconDashboard,
  IconSettings,
} from '@tabler/icons-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar';
import Link from 'next/link';
import type * as React from 'react';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/thinking-angel.png',
  },
  navMain: [
    {
      title: 'Overview',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Trace',
      url: '/dashboard/trace',
      icon: IconBinaryTree,
    },
    {
      title: 'Usage',
      url: '/dashboard/usage',
      icon: IconCurrencyDollar,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <span className="text-xl">😇</span>
                <span className="font-semibold text-base">Divine Agent</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
