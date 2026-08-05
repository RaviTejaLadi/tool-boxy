// @ts-nocheck — typed gradually
import { Upload } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useComposerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ImagesSection() {
  const addImage = useComposerStore((s) => s.addImage);
  const fileInputRef = useRef(null);

  const handleImageFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => addImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <section>
      <SectionHeading className="mb-3">Upload images</SectionHeading>
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-auto w-full flex-col items-center gap-2 border-dashed py-10"
        >
          <Upload className="size-6" />
          <span className="text-sm">Upload from device</span>
          <span className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageFile(file);
            e.target.value = '';
          }}
        />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Images stay on your device — nothing is uploaded to any server. Large images are stored in your browser local
          storage.
        </p>
      </div>
    </section>
  );
}
