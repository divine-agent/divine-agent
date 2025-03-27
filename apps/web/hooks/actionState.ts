import { useActionState } from 'react';

export function useResetableActionState<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  permalink?: string
): [
  state: Awaited<State>,
  dispatch: (payload: Payload | null) => void,
  isPending: boolean,
  reset: () => void,
] {
  const [state, submit, isPending] = useActionState(
    (state: Awaited<State>, payload: Payload | null) => {
      if (!payload) {
        return initialState;
      }
      return action(state, payload);
    },
    initialState,
    permalink
  );

  const reset = () => {
    submit(null);
  };

  return [state, submit, isPending, reset];
}
