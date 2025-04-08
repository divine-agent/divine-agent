import { Modal } from '@/components/Modal';
import { TraceWaterfallChart } from '@/components/trace-chart';
import { getTraceChartData } from '@/lib/server/span';

interface TraceModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function TraceModalPage(props: TraceModalPageProps) {
  const { id } = await props.params;
  const data = await getTraceChartData(id);

  return (
    <Modal title="Trace" description="trace">
      {id}
      <TraceWaterfallChart data={data} />
    </Modal>
  );
}
