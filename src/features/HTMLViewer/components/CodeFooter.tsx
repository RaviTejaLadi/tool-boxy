import { useRef } from 'react';
import { Copy, Share2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewerStore } from '../stores';

export function CodeFooter() {
  const htmlCode = useViewerStore((s) => s.htmlCode);
  const setHtmlCode = useViewerStore((s) => s.setHtmlCode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setHtmlCode(reader.result);
    };
    reader.readAsText(file);
  };

  const handleCopy = async () => {
    if (!htmlCode) return;
    await navigator.clipboard.writeText(htmlCode);
  };

  const handleShare = async () => {
    if (!htmlCode.trim()) return;
    const file = new File([htmlCode], 'preview.html', { type: 'text/html' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'HTML' });
      return;
    }
    await navigator.clipboard.writeText(htmlCode);
  };

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-t border-border px-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm,text/html"
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
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!htmlCode}>
          <Copy data-icon="inline-start" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} disabled={!htmlCode.trim()}>
          <Share2 data-icon="inline-start" />
          Share
        </Button>
      </div>
    </div>
  );
}
