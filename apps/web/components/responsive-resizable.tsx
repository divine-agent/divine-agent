'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import type { ReactNode } from 'react';

interface ResponsiveResizableProps {
  first: ReactNode;
  second: ReactNode;
}

export function ResponsiveResizable({
  first,
  second,
}: ResponsiveResizableProps) {
  const isMobile = useIsMobile();
  if (isMobile === undefined) {
    return null;
  }
  const direction = isMobile ? 'vertical' : 'horizontal';

  return (
    <ResizablePanelGroup direction={direction}>
      <ResizablePanel defaultSize={50}>{first}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>{second}</ResizablePanel>
    </ResizablePanelGroup>
  );
}
