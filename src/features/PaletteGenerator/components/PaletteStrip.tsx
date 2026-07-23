import { Lock, Unlock, Copy, Trash2 } from 'lucide-react';
import { usePaletteStore } from '../stores';
import { ColorActionButton } from './ColorActionButton';

export function PaletteStrip() {
  const colors = usePaletteStore((s) => s.colors);
  const toggleLock = usePaletteStore((s) => s.toggleLock);
  const duplicateOne = usePaletteStore((s) => s.duplicateOne);
  const deleteOne = usePaletteStore((s) => s.deleteOne);

  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex flex-col sm:flex-row">
        {colors.map((c, i) => (
          <div
            key={c.id}
            className="flex min-w-0 flex-1 flex-col border-b border-border last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
          >
            <div className="relative flex h-40 items-start p-3 sm:h-48" style={{ backgroundColor: c.hex }}>
              <span className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[11px] text-white/80">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="border-t border-border px-3 py-3">
              <div className="font-mono text-[13px] font-bold">{c.hex}</div>
              <div className="truncate text-[12px] text-muted-foreground">{c.name}</div>
            </div>
            <div className="flex gap-1.5 px-2 pb-2">
              <ColorActionButton
                icon={c.locked ? Lock : Unlock}
                active={c.locked}
                title={c.locked ? 'Unlock colour' : 'Lock colour'}
                onClick={() => toggleLock(c.id)}
              />
              <ColorActionButton icon={Copy} title="Duplicate colour" onClick={() => duplicateOne(c.id)} />
              <ColorActionButton icon={Trash2} title="Delete colour" danger onClick={() => deleteOne(c.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
