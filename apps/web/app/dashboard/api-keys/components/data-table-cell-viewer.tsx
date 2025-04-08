'use client';

import { createToastCallbacks } from '@/lib/callback/toast-callback';
import { withCallbacks } from '@/lib/callback/with-callback';
import { Button } from '@workspace/ui/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@workspace/ui/components/drawer';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { useActionState } from 'react';
import type { z } from 'zod';
import { updateAPIKey } from '../actions';
import { permissions } from '../data/data';
import type { apiKeySchema as schema } from '../data/schema';

export function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();
  const [, updateAction, updatePending] = useActionState(
    withCallbacks(
      updateAPIKey.bind(null, item.id),
      createToastCallbacks({ loadingMessage: 'Updating API Key...' })
    ),
    null
  );
  if (isMobile === undefined) {
    return null;
  }

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit text-left text-foreground">
          {item.name || 'Secret Key'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>API Key</DrawerTitle>
          <DrawerDescription>
            Update the API key: {item.name || 'Secret Key'}
          </DrawerDescription>
        </DrawerHeader>
        <form
          action={updateAction}
          className="flex h-full flex-col justify-between"
        >
          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={item.name || 'Secret Key'}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="permission">Permission</Label>
              <Select defaultValue={item.permission}>
                <SelectTrigger id="permission" className="w-full">
                  <SelectValue placeholder="Permission" />
                </SelectTrigger>
                <SelectContent>
                  {permissions.map((permission) => (
                    <SelectItem key={permission.label} value={permission.value}>
                      {<permission.icon className={permission.className} />}
                      {permission.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" defaultValue={item.api_key} disabled />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="created">Created At</Label>
              <Input id="created" defaultValue={item.created_at} disabled />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="submit" disabled={updatePending}>
                Submit
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
