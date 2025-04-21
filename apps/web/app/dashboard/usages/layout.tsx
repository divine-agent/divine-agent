import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';
import type React from 'react';

interface UsagesLayoutProps {
  children: React.ReactNode;
}

export default function UsagesLayout({ children }: UsagesLayoutProps) {
  return (
    <div className="h-full space-y-3 overflow-y-auto py-3">
      <ScrollArea className="max-h-full">
        <div className="flex items-center justify-between px-6">
          <h1 className=" text-xl tracking-tight">Usage</h1>
        </div>
        <Separator className="my-3" />
        <div className="px-6">
          <p className="text-muted-foreground text-sm">
            You can view all usages in this account.
          </p>
          <div className="my-6">{children}</div>
        </div>
      </ScrollArea>
    </div>
  );
}
