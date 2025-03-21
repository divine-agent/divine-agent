import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { getCurrentUser } from '@/lib/server/auth';
import {
  SidebarInset,
  SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { cookies } from 'next/headers';
import type { CSSProperties, ReactNode } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 58)',
        } as CSSProperties
      }
    >
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
