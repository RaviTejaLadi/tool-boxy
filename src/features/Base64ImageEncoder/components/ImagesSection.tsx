import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEncoderStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ImagesSection() {
  const images = useEncoderStore((s) => s.images);
  const selectedId = useEncoderStore((s) => s.selectedId);
  const selectImage = useEncoderStore((s) => s.selectImage);
  const removeImage = useEncoderStore((s) => s.removeImage);

  if (images.length === 0) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Images</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">No images encoded yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Images · {images.length}</SectionHeading>

      <ul className="space-y-2">
        {images.map((img) => {
          const isActive = (selectedId ?? images[0]?.id) === img.id;
          return (
            <li key={img.id}>
              <div
                className={`flex items-center gap-2 border px-2 py-2 transition-colors ${
                  isActive ? 'border-primary bg-primary/5' : 'border-border bg-background'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectImage(img.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <img
                    src={img.dataUri}
                    alt=""
                    className="size-8 shrink-0 border border-border object-contain bg-muted/30"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{img.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{img.size}</p>
                  </div>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeImage(img.id)}
                  title="Remove"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
