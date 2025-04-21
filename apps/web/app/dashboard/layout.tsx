import { AppSidebar } from './components/app-sidebar';
import { SiteHeader } from './components/site-header';
import { getCurrentUser } from '@/lib/server/auth';
import { deleteSessionTokenCookie } from '@/lib/server/cookies';
import {
  SidebarInset,
  SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Sign out
 * @description Sign out the user and redirect to the home page
 */
async function signout() {
  'use server';

  await deleteSessionTokenCookie();
  redirect('/');
}

export default async function DashboardLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal?: ReactNode;
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
      className="max-h-screen"
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 58)',
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} signoutAction={signout} />
      <SidebarInset>
        <SiteHeader />
        {modal}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
