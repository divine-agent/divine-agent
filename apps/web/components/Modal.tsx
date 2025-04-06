'use client';
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
import { useRouter } from 'next/navigation';
import type * as React from 'react';
import { useState } from 'react';

export function Modal({
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
