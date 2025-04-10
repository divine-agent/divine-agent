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
  direction?: 'horizontal' | 'vertical';
}

export function ResponsiveResizable({
  first,
  second,
  direction,
}: ResponsiveResizableProps) {
  const isMobile = useIsMobile();
  if (isMobile === undefined) {
    return null;
  }
  const _direction = direction ?? (isMobile ? 'vertical' : 'horizontal');

  return (
    <ResizablePanelGroup direction={_direction}>
      <ResizablePanel defaultSize={50} minSize={25}>
        {first}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>{second}</ResizablePanel>
    </ResizablePanelGroup>
  );
}
