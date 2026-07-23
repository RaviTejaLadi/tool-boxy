// @ts-nocheck — typed gradually
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LANGUAGES } from '../constants';
import { useCodeStore } from '../stores';

export function PreviewPane({ svg, isTransparent }) {
  const title = useCodeStore((s) => s.title);
  const langId = useCodeStore((s) => s.langId);
  const setTitle = useCodeStore((s) => s.setTitle);
  const setLangId = useCodeStore((s) => s.setLangId);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div className="pointer-events-none absolute top-3 right-3 z-10 flex h-8 items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="File name"
          aria-label="File name"
          className="pointer-events-auto h-8 w-44 bg-background/90 shadow-sm backdrop-blur-sm"
        />
        <Select value={langId} onValueChange={(value) => value && setLangId(value)}>
          <SelectTrigger
            aria-label="Language"
            className="pointer-events-auto h-8 w-[140px] bg-background/90 shadow-sm backdrop-blur-sm data-[size=default]:h-8"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {Object.entries(LANGUAGES).map(([id, language]) => (
              <SelectItem key={id} value={id}>
                {language.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        className="h-0 min-h-0 flex-1"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex min-h-full justify-center p-8 pt-14 lg:p-14 lg:pt-16">
          <div
            className="max-w-full [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full"
            style={
              isTransparent
                ? {
                    backgroundImage:
                      'repeating-conic-gradient(color-mix(in oklab, var(--muted-foreground) 35%, transparent) 0% 25%, transparent 0% 50%)',
                    backgroundSize: '16px 16px',
                    borderRadius: 12,
                  }
                : undefined
            }
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
