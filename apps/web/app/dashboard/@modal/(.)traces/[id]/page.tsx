import { ResponsiveDrawer } from '@/components/Modal';
import { TraceBoard } from '@/app/dashboard/traces/(children)/[id]/components/trace-board';
import { getTraceChartData } from '@/lib/server/span';

interface TraceModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function TraceModalPage(props: TraceModalPageProps) {
  const { id } = await props.params;
  const spans = await getTraceChartData(id);

  return (
    <ResponsiveDrawer
      title="Trace"
      description="Click expand button to view full trace"
    >
      <TraceBoard spans={spans} direction="vertical" />
    </ResponsiveDrawer>
  );
}
