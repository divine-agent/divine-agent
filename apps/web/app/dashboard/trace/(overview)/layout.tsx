import { Separator } from '@workspace/ui/components/separator';
import type React from 'react';

interface TracesLayoutProps {
  children: React.ReactNode;
}

export default function TracesLayout({ children }: TracesLayoutProps) {
  return (
    <div className="space-y-3 py-3">
      <div className="flex items-center justify-between px-6">
        <h1 className=" text-xl tracking-tight">Trace</h1>
      </div>
      <Separator className="my-3" />
      <div className="px-6">
        <p className="text-muted-foreground text-sm">
          You can view and manage all traces in this account.
        </p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
