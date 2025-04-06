import { Modal } from '@/components/Modal';
import { TraceWaterfallChart } from '@/components/trace-chart';

interface TraceModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function TraceModalPage(props: TraceModalPageProps) {
  const { id } = await props.params;
  return (
    <Modal title="Trace" description="trace">
      {id}
      <TraceWaterfallChart />
    </Modal>
  );
}
