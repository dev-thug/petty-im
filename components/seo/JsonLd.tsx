/** Structured data. Only fields we can actually stand behind belong here —
 * an invented rating or price is a manual-action risk, not a ranking boost. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Values come from our own content modules, never from visitor input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
