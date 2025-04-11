import type { ExtendedSpan } from '@/lib/types/span';
import { Separator } from '@workspace/ui/components/separator';
import Highlighter from './Highter';

interface SpanProps {
  span: ExtendedSpan;
}

export function Span({ span }: SpanProps) {
  return (
    <>
      <div>{span.name}</div>
      <Separator />
      <div>{span.input?.model}</div>
      <Separator />
      <div>
        <Highlighter
          content={JSON.stringify(span.input?.messages?.[0] ?? '', null, 2)}
          language="json"
        />
      </div>
      <Separator />
      <div>
        <Highlighter
          content={JSON.stringify(span.completion?.choices?.[0] ?? '', null, 2)}
          language="json"
        />
      </div>
    </>
  );
}
