import type { ExtendedSpan } from '@/lib/types/span';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Card, CardContent } from '@workspace/ui/components/card';
import Highlighter from './Highter';

interface SpanProps {
  span: ExtendedSpan;
}

export function Span({ span }: SpanProps) {
  const messages = span.input?.messages ?? [];
  const choices = span.completion?.choices ?? [];
  return (
    <Accordion type="multiple" defaultValue={['properties', 'Input', 'Output']}>
      <AccordionItem className="px-4" value="properties">
        <AccordionTrigger className="hover:no-underline">
          Properties
        </AccordionTrigger>
        <AccordionContent>{span.name}</AccordionContent>
      </AccordionItem>
      <AccordionJsonCards name="Input" datas={messages} />
      <AccordionJsonCards name="Output" datas={choices} />
    </Accordion>
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
