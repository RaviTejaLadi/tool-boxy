import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTypeLabel } from '../constants';
import { downloadFavicon } from '../helpers';
import { useFaviconStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function SizesSection() {
  const favicons = useFaviconStore((s) => s.favicons);
  const selectedId = useFaviconStore((s) => s.selectedId);
  const selectFavicon = useFaviconStore((s) => s.selectFavicon);
  const isGenerating = useFaviconStore((s) => s.isGenerating);

  if (isGenerating) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Sizes</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">Generating favicons…</p>
      </section>
    );
  }

  if (favicons.length === 0) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Sizes</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">Upload an image to generate sizes.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Sizes · {favicons.length}</SectionHeading>

      <ul className="space-y-2">
        {favicons.map((fav) => {
          const isActive = (selectedId ?? favicons[0]?.id) === fav.id;
          return (
            <li key={fav.id}>
              <div
                className={`flex items-center gap-2 border px-2 py-2 transition-colors ${
                  isActive ? 'border-primary bg-primary/5' : 'border-border bg-background'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectFavicon(fav.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <img
                    src={fav.dataUrl}
                    alt={fav.label}
                    className="size-8 shrink-0 border border-border bg-muted/30 object-contain"
                    style={{ imageRendering: fav.size <= 32 ? 'pixelated' : undefined }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{fav.fileName}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {fav.label} · {getTypeLabel(fav.type)}
                    </p>
                  </div>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => downloadFavicon(fav)}
                  title="Download"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
