import type { ActionState } from '@/lib/types/state';
import { toast } from 'sonner';

type CreateToastCallbacksOptions = { loadingMessage?: string };

export const createToastCallbacks = (options: CreateToastCallbacksOptions) => {
  return {
    onStart: () => {
      return toast.loading(options.loadingMessage || 'Loading ...');
    },
    onEnd: (reference: string | number) => {
      toast.dismiss(reference);
    },
    onSuccess: (result: ActionState) => {
      if (result?.message) {
        toast.success(result.message);
      }
    },
    onError: (result: ActionState) => {
      if (result?.message) {
        toast.error(result.message);
      }
    },
  };
};
