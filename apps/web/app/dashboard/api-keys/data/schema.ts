import { z } from 'zod';

export const apiKeySchema = z.object({
  id: z.string(),
  name: z.string().optional().nullable(),
  api_key: z.string(),
  created_at: z.string(),
  permission: z.enum(['all']).default('all').optional(),
});

export type APIKey = z.infer<typeof apiKeySchema>;
