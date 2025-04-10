import { ResponsiveDrawer } from '@/components/Modal';
import { TraceBoard } from '@/components/trace-board';
import { getTraceChartData } from '@/lib/server/span';
import { Button } from '@workspace/ui/components/button';
import { Expand } from 'lucide-react';

interface TraceModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function TraceModalPage(props: TraceModalPageProps) {
  const { id } = await props.params;
  const spans = await getTraceChartData(id);

  return (
    <ResponsiveDrawer title="Trace" description="trace">
      <Button variant="ghost" asChild>
        <a href={`/dashboard/traces/${id}`}>
          <Expand />
        </a>
      </Button>
      <TraceBoard spans={spans} direction="vertical" />
    </ResponsiveDrawer>
  );
}
