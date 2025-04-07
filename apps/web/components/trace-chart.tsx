'use client';

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

const chartData = [
  { month: 'January', desktop: 0, mobile: 1000 },
  { month: 'February', desktop: 0, mobile: 200 },
  { month: 'March', desktop: 200, mobile: 600 },
  { month: 'April', desktop: 0, mobile: 800 },
  { month: 'May', desktop: 0, mobile: 300 },
  { month: 'June', desktop: 300, mobile: 700 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'transparent',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function TraceWaterfallChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis hide type="number" />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={4}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
