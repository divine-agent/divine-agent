import { columns } from './components/columns';
import { TasksDataTable } from './components/data-table';
import type { Trace } from './data/schema';

export default function TracePage() {
  const data: Trace[] = [
    {
      id: 'uuid-trace-1111',
      session_id: 'uuid-session',
      name: 'otrace1',
      start_time: '2021-09-01T00:00:00Z',
      end_time: '2021-09-01T00:00:00Z',
      status: 'running',
    },
    {
      id: 'uuid-trace-1112',
      session_id: 'uuid-session',
      name: 'trace1',
      start_time: '2021-09-01T00:00:00Z',
      end_time: '2021-09-01T00:00:00Z',
      status: 'done',
    },
    {
      id: 'uuid-trace-1113',
      session_id: 'uuid-session-2222',
      name: 'trace1',
      start_time: '2021-09-01T00:00:00Z',
      end_time: '2021-09-01T00:00:00Z',
      status: 'canceled',
    },
  ];
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <TasksDataTable
          data={Array.from({ length: 10 }, () => data).flat()}
          columns={columns}
        />
      </div>
    </div>
  );
}
