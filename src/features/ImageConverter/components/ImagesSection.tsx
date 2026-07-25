import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadConverted } from '../helpers';
import { useConverterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ImagesSection() {
  const images = useConverterStore((s) => s.images);
  const converted = useConverterStore((s) => s.converted);
  const selectedId = useConverterStore((s) => s.selectedId);
  const selectImage = useConverterStore((s) => s.selectImage);
  const removeImage = useConverterStore((s) => s.removeImage);

  if (images.length === 0) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Images</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">No images selected yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">
        Images · {images.length}
        {converted.length > 0 ? ` · ${converted.length} converted` : ''}
      </SectionHeading>

      <ul className="space-y-2">
        {images.map((img) => {
          const isActive = (selectedId ?? images[0]?.id) === img.id;
          const result = converted.find((c) => c.sourceId === img.id);
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
                    src={result?.dataUrl ?? img.dataUrl}
                    alt=""
                    className="size-8 shrink-0 border border-border bg-muted/30 object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{result?.name ?? img.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {result
                        ? `${result.size} · ${result.width}×${result.height}`
                        : `${img.size} · ${img.width}×${img.height}`}
                    </p>
                  </div>
                </button>
                {result && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => downloadConverted(result)}
                    title="Download"
                  >
                    <Download className="size-3.5" />
                  </Button>
                )}
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
