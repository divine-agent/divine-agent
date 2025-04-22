'use client';

import type { ExtendedUsageResult } from '@/lib/types/usage';
import type { UsageResult } from '@workspace/graphql-client/src/types.generated';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Label, Pie, PieChart } from 'recharts';

const chartConfig = {
  input_tokens: {
    label: 'Input Tokens',
    color: 'var(--chart-1)',
  },
  output_tokens: {
    label: 'Output Tokens',
    color: 'var(--chart-2)',
  },
  total_tokens: {
    label: 'Total Tokens',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

interface UsageChartProps {
  data: ExtendedUsageResult[] | undefined;
}

export function UsageLineChartCard({ data }: UsageChartProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>
          Showing tokens for the specified date range
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <UsageLineChart data={data} />
      </CardContent>
    </Card>
  );
}

export function UsageLineChart({ data }: UsageChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="formatted_date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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

interface Tokens {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

interface UsagePieChartProps {
  data: UsageResult[] | undefined;
}

export function UsagePieChartCard({ data }: UsagePieChartProps) {
  const keys: (keyof Tokens)[] = [
    'input_tokens',
    'output_tokens',
    'total_tokens',
  ];

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
        <CardDescription>
          Showing tokens for the various models in the specified date range
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center px-2 pt-4 sm:px-6 sm:pt-6">
        {keys.map((key) => (
          <UsagePieChart key={key} data={data} dataKey={key} />
        ))}
      </CardContent>
    </Card>
  );
}

function UsagePieChart({
  data,
  dataKey,
}: UsagePieChartProps & { dataKey: keyof Tokens }) {
  const chartColorsLength = 3;
  const chartData = data?.map((item, index) => ({
    ...item,
    fill: `var(--chart-${(index % chartColorsLength) + 1})`,
  }));
  const pieChartConfig = Object.fromEntries(
    (chartData ?? []).map((item) => [
      item.model,
      {
        color: item.fill,
      },
    ])
  ) satisfies ChartConfig;

  const totalTokens = useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr[dataKey], 0);
  }, [data, dataKey]);

  return (
    <ChartContainer
      config={pieChartConfig}
      className="mx-auto aspect-square min-w-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey={dataKey}
          nameKey="model"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-bold text-3xl"
                    >
                      {totalTokens?.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {dataKey.replace(/_/g, ' ')}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
