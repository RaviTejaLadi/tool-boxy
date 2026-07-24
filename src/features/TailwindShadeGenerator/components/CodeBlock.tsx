import { CopyButton } from './CopyButton';

export function CodeBlock({ title, id, code }: { title: string; id: string; code: string }) {
  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <CopyButton text={code} id={id} />
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6 text-primary">{code}</pre>
    </div>
  );
}
