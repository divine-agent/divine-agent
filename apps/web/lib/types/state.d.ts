export type ActionState<D = unknown> =
  | {
      message: string;
      status: 'SUCCESS' | 'ERROR';
      data?: D;
    }
  | null
  | undefined;
