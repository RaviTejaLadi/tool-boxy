import { SectionHeading } from './SectionHeading';

const INFO = [
  {
    title: 'UUID v4',
    description: 'Randomly generated using a cryptographically secure RNG. Best for general-purpose identifiers.',
  },
  {
    title: 'UUID v7',
    description:
      'Timestamp-based with millisecond precision and a random suffix. Useful for chronologically sortable database keys.',
  },
] as const;

export function InfoSection() {
  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Info</SectionHeading>
      <div className="space-y-2">
        {INFO.map((item) => (
          <div key={item.title} className="border border-border bg-muted/30 px-3 py-2">
            <span className="font-mono text-xs text-primary">{item.title}</span>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
