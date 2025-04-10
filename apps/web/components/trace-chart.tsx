'use client';

import type { ExtendedSpan } from '@/lib/types/span';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import { Timer } from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Rectangle,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

const chartConfig = {
  transparent: {
    color: 'transparent',
  },
  SPAN_KIND_FUNCTION: {
    color: 'var(--chart-1)',
  },
  SPAN_KIND_LLM: {
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface TraceWaterfallChartProps {
  data: ExtendedSpan[];
  activeIndex?: number;
  selectAction: (data: ExtendedSpan, index: number) => void;
}

export function TraceWaterfallChart({
  data,
  activeIndex,
  selectAction,
}: TraceWaterfallChartProps) {
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
        <XAxis hide type="number" domain={['dataMin', 'dataMax']} />
        <YAxis dataKey="name" type="category" hide />
        <ChartTooltip content={<ChartTooltipContent />} formatter={formatter} />
        <Bar
          dataKey="relative_start_time"
          stackId="a"
          fill="var(--color-transparent)"
          radius={4}
        />
        <Bar
          dataKey="duration"
          stackId="a"
          radius={4}
          strokeWidth={2}
          activeIndex={activeIndex}
          activeBar={({ ...props }) => {
            return (
              <Rectangle
                {...props}
                fillOpacity={0.8}
                stroke={`var(--color-${props.payload.kind})`}
                strokeDasharray={4}
                strokeDashoffset={4}
              />
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`var(--color-${entry.kind})`}
              onClick={selectAction.bind(null, entry, index)}
            />
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
