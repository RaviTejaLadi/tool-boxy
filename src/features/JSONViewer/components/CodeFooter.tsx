import { useRef } from 'react';
import { Copy, Download, Share2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadText } from '../helpers';
import { useJsonStore } from '../stores';

export function CodeFooter() {
  const jsonCode = useJsonStore((s) => s.jsonCode);
  const setJsonCode = useJsonStore((s) => s.setJsonCode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setJsonCode(reader.result);
    };
    reader.readAsText(file);
  };

  const handleCopy = async () => {
    if (!jsonCode) return;
    await navigator.clipboard.writeText(jsonCode);
  };

  const handleDownload = () => {
    if (!jsonCode.trim()) return;
    downloadText(jsonCode, 'data.json', 'application/json');
  };

  const handleShare = async () => {
    if (!jsonCode.trim()) return;
    const file = new File([jsonCode], 'data.json', { type: 'application/json' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'JSON' });
      return;
    }
    await navigator.clipboard.writeText(jsonCode);
  };

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-t border-border px-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
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
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!jsonCode}>
          <Copy data-icon="inline-start" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!jsonCode.trim()}>
          <Download data-icon="inline-start" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} disabled={!jsonCode.trim()}>
          <Share2 data-icon="inline-start" />
          Share
        </Button>
      </div>
    </div>
  );
}
