import { Check, Copy, Braces, FileJson, Download } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { describeColor, downloadPaletteImage } from '../helpers';
import { usePaletteStore } from '../stores';

function ExportButton({
  icon: Icon,
  label,
  onClick,
  copied,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  copied?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="h-auto flex-1 rounded-none border-r border-border py-3 last:border-r-0"
    >
      {copied ? <Check className="size-3.5 text-primary" /> : <Icon className="size-3.5" />}
      <span>{copied ? 'Copied!' : label}</span>
    </Button>
  );
}

async function copyText(text: string, tag: string, flashCopied: (tag: string) => void) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable — still flash UI
  }
  flashCopied(tag);
}

export function ExportSection() {
  const colors = usePaletteStore((s) => s.colors);
  const copiedTag = usePaletteStore((s) => s.copiedTag);
  const flashCopied = usePaletteStore((s) => s.flashCopied);

  const handleCopyColours = () => {
    void copyText(colors.map((c) => c.hex).join(', '), 'colours', flashCopied);
  };

  const handleCopyCssVars = () => {
    const body = colors.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`).join('\n');
    void copyText(`:root {\n${body}\n}`, 'css', flashCopied);
  };

  const handleCopyJson = () => {
    const data = colors.map((c) => ({ hex: c.hex, name: c.name, ...describeColor(c.hex) }));
    void copyText(JSON.stringify(data, null, 2), 'json', flashCopied);
  };

  const handleDownloadImage = () => {
    downloadPaletteImage(colors);
  };

  return (
    <div>
      <p className="mb-2 border-b border-border pb-1 font-mono text-[11px] tracking-wide text-primary">Export</p>
      <div className="flex overflow-hidden border border-border bg-card">
        <ExportButton icon={Copy} label="Copy Colours" onClick={handleCopyColours} copied={copiedTag === 'colours'} />
        <ExportButton icon={Braces} label="CSS Variables" onClick={handleCopyCssVars} copied={copiedTag === 'css'} />
        <ExportButton icon={FileJson} label="JSON" onClick={handleCopyJson} copied={copiedTag === 'json'} />
        <ExportButton icon={Download} label="Download Image" onClick={handleDownloadImage} />
      </div>
    </div>
  );
}
