// @ts-nocheck — typed gradually
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { THEMES } from '../constants';
import { useThemeStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ThemeSection() {
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);

  return (
    <section>
      <SectionHeading className="mb-3">Theme</SectionHeading>
      <Select value={themeId} onValueChange={(value) => value && setThemeId(value)}>
        <SelectTrigger className="h-9 w-full text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THEMES.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <span className="flex items-center gap-2">
                <span className="flex gap-0.5" aria-hidden>
                  <span className="size-2 rounded-full" style={{ backgroundColor: theme.colors.keyword }} />
                  <span className="size-2 rounded-full" style={{ backgroundColor: theme.colors.string }} />
                  <span className="size-2 rounded-full" style={{ backgroundColor: theme.colors.function }} />
                </span>
                {theme.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
