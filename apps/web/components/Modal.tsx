'use client';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@workspace/ui/components/dialog';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { Expand } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type * as React from 'react';
import { useState } from 'react';

export function ResponsiveModal({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      setTimeout(router.back, 200);
    }
  };

  if (isDesktop) {
    return (
      <Dialog defaultOpen={false} open={open} onOpenChange={handleOpenChange}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer defaultOpen={false} open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export function ResponsiveDrawer({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      setTimeout(router.back, 200);
    }
  };

  return (
    <Drawer
      defaultOpen={false}
      open={open}
      onOpenChange={handleOpenChange}
      direction="right"
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-between">
            <Button variant="ghost" size="icon" asChild>
              <a href={pathname}>
                <Expand />
              </a>
            </Button>
            {title}
          </DrawerTitle>
          <DrawerDescription className="text-end">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
