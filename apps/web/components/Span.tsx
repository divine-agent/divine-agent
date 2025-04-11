import type { ExtendedSpan } from '@/lib/types/span';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Timer } from 'lucide-react';
import Highlighter from './Highter';

interface SpanProps {
  span: ExtendedSpan;
}

export function Span({ span }: SpanProps) {
  const messages = span.input?.messages ?? [];
  const choices = span.completion?.choices ?? [];
  return (
    <>
      <GeneralInfo span={span} />
      <Accordion
        type="multiple"
        defaultValue={['properties', 'Input', 'Output']}
      >
        <AccordionProperties span={span} />
        <AccordionJsonCards name="Input" datas={messages} />
        <AccordionJsonCards name="Output" datas={choices} />
      </Accordion>
    </>
  );
}

function GeneralInfo({ span }: SpanProps) {
  return (
    <div className="flex flex-col gap-3 border-b p-4">
      <div className="flex items-center justify-between text-text-primary">
        <span className="font-medium">
          <span>{span.name}</span>
        </span>
      </div>
      <div className="flex gap-3">
        <Badge variant="secondary">{span.kind}</Badge>
        <Badge variant="outline">
          <Timer />
          {span.duration} ms
        </Badge>
      </div>
    </div>
  );
}

function AccordionProperties({ span }: SpanProps) {
  // TODO select the properties to show
  return (
    <AccordionItem className="px-4" value="properties">
      <AccordionTrigger className="hover:no-underline">
        Properties
      </AccordionTrigger>
      <AccordionContent>
        {span.completion?.usage?.total_tokens}
      </AccordionContent>
    </AccordionItem>
  );
}

interface AccordionCardsProps<T> {
  name: string;
  datas: T[];
}

function AccordionJsonCards<T>({ name, datas }: AccordionCardsProps<T>) {
  return (
    <AccordionItem value={name} className="px-4">
      <AccordionTrigger className="hover:no-underline">{name}</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-3">
        {datas.map((data, index) => (
          <Card key={index}>
            <CardContent>
              <Highlighter
                content={JSON.stringify(data, null, 2)}
                language="json"
              />
            </CardContent>
          </Card>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
