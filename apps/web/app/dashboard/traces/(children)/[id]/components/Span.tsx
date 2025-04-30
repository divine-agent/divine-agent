import Highlighter from '@/components/Highter';
import type { ExtendedSpan } from '@/lib/types/span';
import { formatDate } from '@/lib/utils';
import {
  Kind,
  type Score,
} from '@workspace/graphql-client/src/types.generated';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Timer } from 'lucide-react';
import type * as React from 'react';

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
        defaultValue={['properties', 'Input', 'Output', 'scores']}
      >
        <AccordionProperties span={span} />
        {span.kind === Kind.SpanKindLlm && (
          <>
            <AccordionJsonCards name="Input" datas={messages} />
            <AccordionJsonCards name="Output" datas={choices} />
          </>
        )}
        {span.kind === Kind.SpanKindEvaluation && (
          <AccordionScores scores={span.scores ?? []} />
        )}
      </Accordion>
    </>
  );
}

function GeneralInfo({ span }: SpanProps) {
  return (
    <div className="flex flex-col gap-3 border-b p-4">
      <div className="flex items-center justify-between text-text-primary">
        <span className="font-medium">{span.name}</span>
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

function AccordionScores({ scores }: { scores: Score[] }) {
  return (
    <AccordionItem value="scores" className="px-4">
      <AccordionTrigger className="hover:no-underline">Scores</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-3">
        {scores.map((score) => (
          <PropertyCard
            title={score.name
              .split('_')
              .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
              .join(' ')}
            key={score.name}
          >
            <PropertyItem label="score" value={score.score} />
            <PropertyItem
              label="explanation"
              value={score.representative_reasoning}
            />
          </PropertyCard>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function AccordionProperties({ span }: SpanProps) {
  // TODO select the properties to show
  const startTime = formatDate(span.start_time);
  const endTime = span.end_time.Valid ? formatDate(span.end_time.Time) : 'N/A';
  const usage = span.completion?.usage;
  // input should pop messages
  const { messages, ...inputs } = span.input ?? {};
  // input parameters display standard: key not starting with __ and value not null or undefined
  const filteredInputs = Object.entries(inputs).filter(
    ([key, value]) =>
      value !== null && value !== undefined && !key.startsWith('__')
  );

  return (
    <AccordionItem className="px-4" value="properties">
      <AccordionTrigger className="hover:no-underline">
        Properties
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-2">
          {filteredInputs.length > 0 && (
            <PropertyCard title="Patameters">
              {filteredInputs.map(([key, value]) => (
                <PropertyItem key={key} label={key} value={value} />
              ))}
            </PropertyCard>
          )}
          {usage && (
            <PropertyCard title="Usages">
              <PropertyItem label="Prompt Tokens" value={usage.prompt_tokens} />
              <PropertyItem
                label="Completion Tokens"
                value={usage.completion_tokens}
              />
              <PropertyItem label="Total Tokens" value={usage.total_tokens} />
            </PropertyCard>
          )}
          <PropertyCard title="Metadatas">
            <PropertyItem label="Start Time" value={startTime} />
            <PropertyItem label="End Time" value={endTime} />
          </PropertyCard>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function PropertyCard({
  title,
  description,
  children,
}: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription> {description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">{children}</CardContent>
    </Card>
  );
}

function PropertyItem({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm">{label}</span>
      <span className="break-words font-light text-sm">{String(value)}</span>
    </div>
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
