import { TraceBoard } from '@/components/trace-board';

interface TracePageProps {
  params: Promise<{ id: string }>;
}

export default async function TracePage(props: TracePageProps) {
  const { id } = await props.params;

  return <TraceBoard id={id} />;
}
