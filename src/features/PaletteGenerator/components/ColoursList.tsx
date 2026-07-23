import { Lock, Unlock, Copy, Shuffle, Trash2 } from 'lucide-react';
import { describeColor } from '../helpers';
import { usePaletteStore } from '../stores';
import { ColorActionButton } from './ColorActionButton';

async function copyText(text: string, tag: string, flashCopied: (tag: string) => void) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable — still flash UI
  }
  flashCopied(tag);
}

export function ColoursList() {
  const colors = usePaletteStore((s) => s.colors);
  const copiedTag = usePaletteStore((s) => s.copiedTag);
  const flashCopied = usePaletteStore((s) => s.flashCopied);
  const toggleLock = usePaletteStore((s) => s.toggleLock);
  const shuffleOne = usePaletteStore((s) => s.shuffleOne);
  const deleteOne = usePaletteStore((s) => s.deleteOne);

  return (
    <div>
      <p className="mb-2 border-b border-border pb-1 font-mono text-[11px] tracking-wide text-primary">Colours</p>
      <div className="divide-y divide-border overflow-hidden border border-border bg-card">
        {colors.map((c) => {
          const { rgb, lch } = describeColor(c.hex);
          return (
            <div key={c.id} className="flex items-center gap-4 px-4 py-3">
              <div className="size-11 shrink-0 border border-border" style={{ backgroundColor: c.hex }} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-sm font-bold">{c.hex}</span>
                  <span className="truncate text-sm text-muted-foreground">{c.name}</span>
                </div>
                <div className="truncate font-mono text-[12px] text-muted-foreground/70">
                  {rgb} &nbsp;|&nbsp; {lch}
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <ColorActionButton
                  icon={c.locked ? Lock : Unlock}
                  active={c.locked}
                  title={c.locked ? 'Unlock colour' : 'Lock colour'}
                  onClick={() => toggleLock(c.id)}
                />
                <ColorActionButton
                  icon={Copy}
                  title="Copy hex"
                  onClick={() => void copyText(c.hex, c.id, flashCopied)}
                />
                <ColorActionButton icon={Shuffle} title="Shuffle colour" onClick={() => shuffleOne(c.id)} />
                <ColorActionButton icon={Trash2} title="Delete colour" danger onClick={() => deleteOne(c.id)} />
              </div>
              {copiedTag === c.id && <span className="shrink-0 text-[11px] text-primary">Copied</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
