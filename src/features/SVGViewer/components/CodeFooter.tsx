import { useRef } from 'react';
import { Copy, Download, Share2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadText } from '../helpers';
import { useViewerStore } from '../stores';

export function CodeFooter() {
  const svgCode = useViewerStore((s) => s.svgCode);
  const setSvgCode = useViewerStore((s) => s.setSvgCode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setSvgCode(reader.result);
    };
    reader.readAsText(file);
  };

  const handleCopy = async () => {
    if (!svgCode) return;
    await navigator.clipboard.writeText(svgCode);
  };

  const handleDownload = () => {
    if (!svgCode.trim()) return;
    downloadText(svgCode, 'icon.svg', 'image/svg+xml');
  };

  const handleShare = async () => {
    if (!svgCode.trim()) return;
    const file = new File([svgCode], 'icon.svg', { type: 'image/svg+xml' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'SVG' });
      return;
    }
    await navigator.clipboard.writeText(svgCode);
  };

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-t border-border px-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          handleUpload(e.target.files);
          e.target.value = '';
        }}
      />
      <Button size="sm" onClick={() => fileInputRef.current?.click()}>
        <Upload data-icon="inline-start" />
        Upload
      </Button>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!svgCode}>
          <Copy data-icon="inline-start" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!svgCode.trim()}>
          <Download data-icon="inline-start" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} disabled={!svgCode.trim()}>
          <Share2 data-icon="inline-start" />
          Share
        </Button>
      </div>
    </div>
  );
}
