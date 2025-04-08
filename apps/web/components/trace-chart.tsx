'use client';

import type { Span } from '@workspace/graphql-client/src/types.generated';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import { Timer } from 'lucide-react';
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts';
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

const chartConfig = {
  transparent: {
    color: 'transparent',
  },
  SPAN_KIND_FUNCTION: {
    color: 'var(--chart-2)',
  },
  SPAN_KIND_LLM: {
    color: 'var(--chart-3)',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig;

interface ExtendedSpan extends Span {
  relative_start_time: number;
}

export function TraceWaterfallChart({ data }: { data: ExtendedSpan[] }) {
  /**
   * formatter function for the tooltip
   * @description only show duration
   * @param value
   * @param name
   * @returns
   */
  const formatter = (value: ValueType, name: NameType) => {
    if (name === 'duration') {
      return (
        <div className="flex min-w-[130px] items-center gap-1 text-muted-foreground text-xs">
          <Timer size={12} />
          Duration
          <div className="ml-auto flex items-baseline gap-0.5 font-medium font-mono text-foreground tabular-nums">
            {value}
            <span className="font-normal text-muted-foreground">ms</span>
          </div>
        </div>
      );
    }
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data} layout="vertical">
        <XAxis hide type="number" />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          hide
        />
        <ChartTooltip
          content={<ChartTooltipContent indicator="dot" />}
          formatter={formatter}
        />
        <Bar
          dataKey="relative_start_time"
          stackId="a"
          fill="var(--color-transparent)"
          radius={4}
        />
        <Bar
          dataKey="duration"
          stackId="a"
          fill="var(--color-function)"
          radius={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`var(--color-${entry.kind})`} />
          ))}
          <LabelList
            dataKey="name"
            position="insideLeft"
            className="fill-background"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
