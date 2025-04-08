import { TraceWaterfallChart } from '@/components/trace-chart';
import { getTraceChartData } from '@/lib/server/span';

interface TracePageProps {
  params: Promise<{ id: string }>;
}

export default async function TracePage(props: TracePageProps) {
  const { id } = await props.params;
  const data = await getTraceChartData(id);

  return (
    <div>
      {id}
      <TraceWaterfallChart data={data} />
      {JSON.stringify(data)}
    </div>
  );
}
