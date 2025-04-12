'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
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
        <div className="h-full overflow-y-auto">
          <ScrollArea className="max-h-full">{first}</ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="h-full overflow-y-auto">
          <ScrollArea className="max-h-full">{second}</ScrollArea>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
