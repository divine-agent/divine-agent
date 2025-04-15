import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';
import type React from 'react';

interface TracesLayoutProps {
  children: React.ReactNode;
}

export default function TracesLayout({ children }: TracesLayoutProps) {
  return (
    <div className="h-full space-y-3 overflow-y-auto py-3">
      <ScrollArea className="max-h-full">
        <div className="flex items-center justify-between px-6">
          <h1 className=" text-xl tracking-tight">Trace</h1>
        </div>
        <Separator className="my-3" />
        <div className="px-6">
          <p className="text-muted-foreground text-sm">
            You can view and manage all traces in this account.
          </p>
          <div className="my-6">{children}</div>
        </div>
      </ScrollArea>
    </div>
  );
}
