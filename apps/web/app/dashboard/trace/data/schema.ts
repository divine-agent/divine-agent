import { z } from 'zod';

export const traceSchema = z.object({
  session_id: z.string(),
  id: z.string(),
  name: z.string().optional().nullable(),
  status: z.enum(['running', 'done', 'canceled']),
  start_time: z.string(),
  end_time: z.string().optional().nullable(),
});

export type Trace = z.infer<typeof traceSchema>;
