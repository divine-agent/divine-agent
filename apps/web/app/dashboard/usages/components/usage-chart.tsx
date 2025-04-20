'use client';

import type { UsageResult } from '@workspace/graphql-client/src/types.generated';
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import type { ChartConfig } from '@workspace/ui/components/chart';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

const chartConfig = {
  input_tokens: {
    // label: 'Input Tokens',
    color: 'var(--chart-1)',
  },
  output_tokens: {
    // label: 'Output Tokens',
    color: 'var(--chart-2)',
  },
  total_tokens: {
    // label: 'Total Tokens',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

interface UsageLineChartProps {
  data: UsageResult[];
}

export function UsageLineChart({ data }: UsageLineChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="formatted_date" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend />
        <Line
          dataKey="total_tokens"
          type="monotone"
          stroke="var(--color-total_tokens)"
        />
        <Line
          dataKey="input_tokens"
          type="monotone"
          stroke="var(--color-input_tokens)"
        />
        <Line
          dataKey="output_tokens"
          type="monotone"
          stroke="var(--color-output_tokens)"
        />
      </LineChart>
    </ChartContainer>
  );
}
