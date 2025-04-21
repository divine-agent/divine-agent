import { TraceBoard } from './components/trace-board';
import { getTraceChartData } from '@/lib/server/span';

interface TracePageProps {
  params: Promise<{ id: string }>;
}

export default async function TracePage(props: TracePageProps) {
  const { id } = await props.params;
  const spans = await getTraceChartData(id);

  return <TraceBoard spans={spans} />;
}
