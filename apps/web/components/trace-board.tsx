'use client';

import type { ExtendedSpan } from '@/lib/types/span';
import { useState } from 'react';
import { Span } from './Span';
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
      second={<Span span={spans[index ?? 0]} />}
      direction={direction}
    />
  );
}
