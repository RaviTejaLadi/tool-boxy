import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MODES, type GenerationMode } from '../constants';
import { useShadeStore } from '../stores';

export function ControlsSection() {
  const baseHex = useShadeStore((s) => s.baseHex);
  const hexDraft = useShadeStore((s) => s.hexDraft);
  const colourName = useShadeStore((s) => s.colourName);
  const mode = useShadeStore((s) => s.mode);
  const setBaseHex = useShadeStore((s) => s.setBaseHex);
  const setHexDraft = useShadeStore((s) => s.setHexDraft);
  const setColourName = useShadeStore((s) => s.setColourName);
  const setMode = useShadeStore((s) => s.setMode);
  const commitHexDraft = useShadeStore((s) => s.commitHexDraft);

  const activeMode = MODES.find((m) => m.value === mode);

  return (
    <div>
      <p className="mb-2 border-b border-border pb-1 font-mono text-[11px] tracking-wide text-primary">Controls</p>
      <div className="grid gap-4 border border-border bg-card p-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Base Colour</Label>
          <div className="flex items-center gap-2">
            <label className="relative size-9 shrink-0 cursor-pointer overflow-hidden border border-border">
              <span className="absolute inset-0" style={{ backgroundColor: baseHex }} />
              <input
                type="color"
                value={baseHex}
                onChange={(e) => setBaseHex(e.target.value)}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                aria-label="Pick base colour"
              />
            </label>
            <Input
              value={hexDraft}
              onChange={(e) => setHexDraft(e.target.value)}
              onBlur={(e) => commitHexDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commitHexDraft(e.currentTarget.value)}
              spellCheck={false}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Colour Name</Label>
          <Input
            value={colourName}
            onChange={(e) => setColourName(e.target.value)}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Generation Mode</Label>
          <Select value={mode} onValueChange={(v) => v && setMode(v as GenerationMode)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-sm">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeMode && <p className="text-xs leading-relaxed text-muted-foreground">{activeMode.description}</p>}
        </div>
      </div>
    </div>
  );
}
