import { TraceWaterfallChart } from '@/components/trace-chart';

interface TracePageProps {
  params: Promise<{ id: string }>;
}

export default async function TracePage(props: TracePageProps) {
  const { id } = await props.params;
  return (
    <div>
      {id}
      <TraceWaterfallChart />
    </div>
  );
}
