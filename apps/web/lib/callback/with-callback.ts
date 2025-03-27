import type { ActionState } from '@/lib/types/state';

type Callbacks<T, R = unknown> = {
  onStart?: () => R;
  onEnd?: (reference: R) => void;
  onSuccess?: (result: T) => void;
  onError?: (result: T) => void;
};

export const withCallbacks = <D, Args extends unknown[], R = unknown>(
  fn: (...args: Args) => Promise<ActionState<D>>,
  callbacks: Callbacks<ActionState<D>, R>
): ((...args: Args) => Promise<ActionState<D>>) => {
  return async (...args: Args) => {
    const promise = fn(...args);
    const reference = callbacks.onStart?.();
    const result = await promise;
    if (reference) {
      callbacks.onEnd?.(reference);
    }
    if (result?.status === 'SUCCESS') {
      callbacks.onSuccess?.(result);
    }
    if (result?.status === 'ERROR') {
      callbacks.onError?.(result);
    }
    return promise;
  };
};
