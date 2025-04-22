'use client';

import {
  IconBinaryTree,
  IconBook,
  IconCurrencyDollar,
  IconKey,
  IconSettings,
} from '@tabler/icons-react';
import type { User } from '@workspace/graphql-client/src/types.generated';
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
import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/thinking-angel.png',
  },
  navMain: [
    // {
    //   title: 'Overview',
    //   url: '/dashboard',
    //   icon: IconDashboard,
    // },
    {
      title: 'Trace',
      url: '/dashboard/traces',
      icon: IconBinaryTree,
    },
    {
      title: 'Usage',
      url: '/dashboard/usages',
      icon: IconCurrencyDollar,
    },
    {
      title: 'API Keys',
      url: '/dashboard/api-keys',
      icon: IconKey,
    },
  ],
  navSecondary: [
    {
      title: 'Docs',
      url: 'https://docs.divine-agent.com',
      icon: IconBook,
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({
  user,
  signoutAction,
  ...props
}: { user: User; signoutAction: () => void } & React.ComponentProps<
  typeof Sidebar
>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/home">
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
        <NavUser user={user} signoutAction={signoutAction} />
      </SidebarFooter>
    </Sidebar>
  );
}
