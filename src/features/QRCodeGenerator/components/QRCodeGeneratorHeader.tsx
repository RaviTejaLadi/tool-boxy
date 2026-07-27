import { Download, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadQrAsPng } from '../helpers';
import { useQrStore } from '../stores';

export function QRCodeGeneratorHeader() {
  const text = useQrStore((s) => s.text);
  const bgColor = useQrStore((s) => s.bgColor);

  const handleDownload = () => {
    const container = document.getElementById('qr-preview-container');
    const svgElement = container?.querySelector('svg');
    if (!svgElement || !text) return;
    downloadQrAsPng(svgElement, bgColor);
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <QrCode className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">QR Code Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Generate customisable QR codes
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={handleDownload} disabled={!text}>
        <Download data-icon="inline-start" />
        Download PNG
      </Button>
    </header>
  );
}
