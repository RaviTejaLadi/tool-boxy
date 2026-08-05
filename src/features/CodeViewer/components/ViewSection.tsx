import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FONT_SIZE_OPTIONS } from '../constants';
import { useCodeViewerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ViewSection() {
  const folderName = useCodeViewerStore((s) => s.folderName);
  const wordWrap = useCodeViewerStore((s) => s.wordWrap);
  const showLineNumbers = useCodeViewerStore((s) => s.showLineNumbers);
  const fontSize = useCodeViewerStore((s) => s.fontSize);
  const setWordWrap = useCodeViewerStore((s) => s.setWordWrap);
  const setShowLineNumbers = useCodeViewerStore((s) => s.setShowLineNumbers);
  const setFontSize = useCodeViewerStore((s) => s.setFontSize);

  if (!folderName) return null;

  return (
    <section className="space-y-3">
      <SectionHeading>View</SectionHeading>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="code-word-wrap" className="font-mono text-[11px] text-muted-foreground">
          Word wrap
        </Label>
        <Switch id="code-word-wrap" checked={wordWrap} onCheckedChange={setWordWrap} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="code-line-numbers" className="font-mono text-[11px] text-muted-foreground">
          Line numbers
        </Label>
        <Switch id="code-line-numbers" checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
      </div>

      <div className="space-y-1.5">
        <Label className="font-mono text-[11px] text-muted-foreground">Font size</Label>
        <Select value={String(fontSize)} onValueChange={(value) => value && setFontSize(Number(value))}>
          <SelectTrigger className="h-8 w-full rounded-none font-mono text-[12px] data-[size=default]:h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
