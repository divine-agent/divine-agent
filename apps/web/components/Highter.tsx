import hljs from 'highlight.js';

interface HighlighterProps {
  content: string;
  language?: string;
}

export default function Highlighter({ content, language }: HighlighterProps) {
  const highlighted = language
    ? hljs.highlight(content, { language })
    : hljs.highlightAuto(content);

  return (
    <pre className="hljs text-wrap">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: insert highlighted code */}
      <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
    </pre>
  );
}
