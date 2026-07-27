import { useJwtStore } from '../stores';
import { SectionHeading } from './SectionHeading';

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border border-border bg-background px-3 py-2">
      <span className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="max-w-[65%] break-all text-right font-mono text-xs">{value}</span>
    </div>
  );
}

function formatClaim(value: unknown): string {
  if (value == null || value === '') return 'N/A';
  return String(value);
}

function formatTimestamp(value: unknown): string {
  if (typeof value !== 'number') return 'N/A';
  return new Date(value * 1000).toLocaleString();
}

export function SummarySection() {
  const decodedData = useJwtStore((s) => s.decodedData);

  const alg = formatClaim(decodedData?.header.alg);
  const typ = formatClaim(decodedData?.header.typ);
  const sub = formatClaim(decodedData?.payload.sub);
  const iss = formatClaim(decodedData?.payload.iss);
  const exp = formatTimestamp(decodedData?.payload.exp);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Summary</SectionHeading>
      <div className="space-y-2">
        <SummaryRow label="Algorithm" value={alg} />
        <SummaryRow label="Type" value={typ} />
        <SummaryRow label="Subject" value={sub} />
        <SummaryRow label="Issuer" value={iss} />
        <SummaryRow label="Expires" value={exp} />
      </div>
    </section>
  );
}
