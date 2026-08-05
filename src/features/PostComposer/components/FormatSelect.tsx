// @ts-nocheck — typed gradually
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FORMAT_GROUPS, findFormat } from '../constants';
import { useComposerStore } from '../stores';

export function FormatSelect() {
  const format = useComposerStore((s) => s.format);
  const setFormat = useComposerStore((s) => s.setFormat);

  return (
    <Select
      value={format.id}
      onValueChange={(value) => {
        const next = findFormat(value);
        if (next) setFormat(next);
      }}
    >
      <SelectTrigger
        aria-label="Canvas size"
        className="pointer-events-auto h-8 w-75 bg-background/90 font-mono text-xs shadow-sm backdrop-blur-sm data-[size=default]:h-8 lg:w-[220px]"
      >
        <SelectValue placeholder="Select size" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {FORMAT_GROUPS.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel className="font-mono text-[10px] tracking-wide uppercase">{group.label}</SelectLabel>
            {group.formats.map((f) => (
              <SelectItem key={f.id} value={f.id} className="font-mono text-xs">
                <span>{f.label}</span>
                <span className="ml-2 text-muted-foreground">
                  {f.w}×{f.h}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
