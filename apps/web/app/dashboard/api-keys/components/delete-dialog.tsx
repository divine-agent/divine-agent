import { createToastCallbacks } from '@/lib/callback/toast-callback';
import { withCallbacks } from '@/lib/callback/with-callback';
import { IconTrash } from '@tabler/icons-react';
import type { ApiKey } from '@workspace/graphql-client/src/types.generated';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { useActionState } from 'react';
import { revokeAPIKey } from '../actions';

export function DeleteDialog({ apiKey }: { apiKey: ApiKey }) {
  const [, revokeAction, revokePending] = useActionState(
    withCallbacks(
      revokeAPIKey.bind(null, apiKey.id),
      createToastCallbacks({
        loadingMessage: 'Revoking API Key...',
      })
    ),
    null
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-100 dark:hover:bg-red-950"
        >
          <IconTrash className="text-red-500 dark:text-red-400" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            This API key will immediately be disabled. API requests made using
            this key will be rejected, which could cause any systems still
            depending on it to break. Once revoked, you'll no longer be able to
            view or modify this API key.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={revokeAction} className="flex flex-col gap-4">
          <Input defaultValue={apiKey.api_key} disabled />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              disabled={revokePending}
              asChild
            >
              <AlertDialogAction>Revoke Key</AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
