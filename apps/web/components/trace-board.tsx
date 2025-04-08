import { getTraceChartData } from '@/lib/server/span';
import { ResponsiveResizable } from './responsive-resizable';
import { TraceWaterfallChart } from './trace-chart';

export async function TraceBoard({ id }: { id: string }) {
  const data = await getTraceChartData(id);
  return (
    <ResponsiveResizable
      first={<TraceWaterfallChart data={data} />}
      second={<span className="font-semibold">Content</span>}
    />
  );
}
