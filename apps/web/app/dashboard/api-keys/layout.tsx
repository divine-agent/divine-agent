import { IconPlus } from '@tabler/icons-react';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import type React from 'react';

interface APIKeysLayoutProps {
  children: React.ReactNode;
}

export default function APIKeysLayout({ children }: APIKeysLayoutProps) {
  return (
    <div className="space-y-3 py-3">
      <div className="flex items-center justify-between px-6">
        <h1 className=" text-xl tracking-tight">API Keys</h1>
        <Button size="sm">
          <IconPlus />
          Create API Keys
        </Button>
      </div>
      <Separator className="my-3" />
      <div className="px-6">
        <p className="text-muted-foreground text-sm">
          As a owner of this account, you can view and manage all API keys in
          this account.
        </p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
