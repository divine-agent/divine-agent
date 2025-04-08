'use client';

import type { Span } from '@workspace/graphql-client/src/types.generated';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

const chartConfig = {
  transparent: {
    label: 'Transparent',
    color: 'transparent',
  },
  function: {
    label: 'SPAN_KIND_FUNCTION',
    color: 'var(--chart-1)',
  },
  llm: {
    label: 'SPAN_KIND_LLM',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface ExtendedSpan extends Span {
  relative_start_time: number;
}

export function TraceWaterfallChart({ data }: { data: ExtendedSpan[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} layout="vertical">
            <XAxis hide type="number" />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
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
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          The trace started at {data[0]?.start_time}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total spans for the trace: {data[0]?.trace_id}
        </div>
      </CardFooter>
    </Card>
  );
}
