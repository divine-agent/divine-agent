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
  if (!spans || spans.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">No data</div>
    );
  }

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
