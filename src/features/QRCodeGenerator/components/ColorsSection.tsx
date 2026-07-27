import { Label } from '@/components/ui/label';
import { useQrStore } from '../stores';
import { SectionHeading } from './SectionHeading';

function ColorPicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </Label>
      <div className="flex items-center gap-2 border border-border bg-background p-1">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 cursor-pointer border-none bg-transparent"
        />
        <span className="font-mono text-xs uppercase text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}

export function ColorsSection() {
  const fgColor = useQrStore((s) => s.fgColor);
  const bgColor = useQrStore((s) => s.bgColor);
  const setFgColor = useQrStore((s) => s.setFgColor);
  const setBgColor = useQrStore((s) => s.setBgColor);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Colors</SectionHeading>
      <div className="grid grid-cols-2 gap-3">
        <ColorPicker id="qr-fg-color" label="Foreground" value={fgColor} onChange={setFgColor} />
        <ColorPicker id="qr-bg-color" label="Background" value={bgColor} onChange={setBgColor} />
      </div>
    </section>
  );
}
