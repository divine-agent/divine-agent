'use client';

import { createToastCallbacks } from '@/lib/callback/toast-callback';
import { withCallbacks } from '@/lib/callback/with-callback';
import type { ActionState } from '@/lib/types/state';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@workspace/graphql-client/src/types.generated';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm({
  user,
  updateAccountAction,
}: {
  user: User;
  updateAccountAction: (
    actionState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}) {
  const [, updateAction, updatePending] = useActionState(
    withCallbacks(
      updateAccountAction,
      createToastCallbacks({
        loadingMessage: 'Updating account...',
      })
    ),
    null
  );

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { name: user.name ?? '' },
  });

  return (
    <Form {...form}>
      <form id="account-form" action={updateAction} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" autoComplete="name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" disabled={updatePending}>
          Update account
        </Button>
      </form>
    </Form>
  );
}
