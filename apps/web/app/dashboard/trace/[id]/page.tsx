import { TraceWaterfallChart } from '@/components/trace-chart';
import { getSpans } from '@/lib/server/span';

interface TracePageProps {
  params: Promise<{ id: string }>;
}

export default async function TracePage(props: TracePageProps) {
  const { id } = await props.params;
  const data = (await getSpans(id)) || [];
  return (
    <div>
      {id}
      <TraceWaterfallChart />
      {JSON.stringify(data)}
    </div>
  );
}
