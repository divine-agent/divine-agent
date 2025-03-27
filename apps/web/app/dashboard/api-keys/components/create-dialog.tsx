'use client';

import { useResetableActionState } from '@/hooks/actionState';
import { createToastCallbacks } from '@/lib/callback/toast-callback';
import { withCallbacks } from '@/lib/callback/with-callback';
import { IconCheck, IconCopy, IconPlus } from '@tabler/icons-react';
import type { ApiKey } from '@workspace/graphql-client/src/types.generated';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { createAPIKey } from '../actions';

export function CreateDialog() {
  const [state, createAction, createPending, resetAction] =
    useResetableActionState(
      withCallbacks(
        createAPIKey,
        createToastCallbacks({ loadingMessage: 'Creating API Key...' })
      ),
      null
    );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {state?.status === 'SUCCESS' && state?.data ? (
          <SuccessContent apiKey={state.data} resetAction={resetAction} />
        ) : (
          <CreateContent
            createAction={createAction}
            createPending={createPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreateContent({
  createAction,
  createPending,
}: { createAction: (payload: FormData) => void; createPending: boolean }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogDescription>
          This API key is tied to your account and can make requests against the
          whole account.
        </DialogDescription>
      </DialogHeader>
      <form action={createAction} className="flex flex-col gap-4">
        <Label htmlFor="name" className="text-right">
          Name
          <span className="font-light text-muted-foreground">Optional</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Secret Key"
          className="col-span-3"
        />
        <DialogFooter>
          <Button type="submit" size="sm" disabled={createPending}>
            Create API Key
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

function SuccessContent({
  apiKey,
  resetAction,
}: { apiKey: ApiKey; resetAction: () => void }) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(apiKey.api_key);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('API key copied to clipboard');
    } catch {
      toast.error('Failed to copy API key');
    }
  };
  const handleDone = () => {
    setTimeout(resetAction, 500);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Save your key</DialogTitle>
        <DialogDescription>
          Please save your secret key in a safe place since you won't be able to
          view it again. Keep it secure, as anyone with your API key can make
          requests on your behalf. If you do lose it, you'll need to generate a
          new one.
        </DialogDescription>
      </DialogHeader>
      <Input defaultValue={apiKey.api_key} disabled />
      <DialogFooter>
        <Button size="sm" onClick={handleCopy}>
          {isCopied ? <IconCheck /> : <IconCopy />} Copy
        </Button>
        <DialogClose asChild>
          <Button size="sm" variant="outline" onClick={handleDone}>
            Done
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
