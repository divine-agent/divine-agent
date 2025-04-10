'use client';

import type { ExtendedSpan } from '@/lib/types/span';
import { useState } from 'react';
import { ResponsiveResizable } from './responsive-resizable';
import { TraceWaterfallChart } from './trace-chart';

interface TraceBoardProps {
  spans: ExtendedSpan[];
  direction?: 'horizontal' | 'vertical';
}

export function TraceBoard({ spans, direction }: TraceBoardProps) {
  const [index, setIndex] = useState<number | undefined>(undefined);
  const selectAction = (_data: ExtendedSpan, index: number) => {
    setIndex(index);
  };

  return (
    <ResponsiveResizable
      first={
        <TraceWaterfallChart
          activeIndex={index}
          data={spans}
          selectAction={selectAction}
        />
      }
      second={
        <span className="font-semibold">
          {JSON.stringify(spans[index ?? 0])}
        </span>
      }
      direction={direction}
    />
  );
}
