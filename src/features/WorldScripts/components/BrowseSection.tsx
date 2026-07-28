import { Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LANGUAGES } from '../constants';
import { getUniqueScripts } from '../helpers';
import { KIND_FILTER_OPTIONS, selectFilteredLanguages, useWorldScriptsStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const SCRIPTS = getUniqueScripts(LANGUAGES);

export function BrowseSection() {
  const browseScript = useWorldScriptsStore((s) => s.browseScript);
  const browseKind = useWorldScriptsStore((s) => s.browseKind);
  const browseDirection = useWorldScriptsStore((s) => s.browseDirection);
  const setBrowseScript = useWorldScriptsStore((s) => s.setBrowseScript);
  const setBrowseKind = useWorldScriptsStore((s) => s.setBrowseKind);
  const setBrowseDirection = useWorldScriptsStore((s) => s.setBrowseDirection);
  const resetBrowseFilters = useWorldScriptsStore((s) => s.resetBrowseFilters);
  const pickRandomLanguage = useWorldScriptsStore((s) => s.pickRandomLanguage);

  const matchCount = selectFilteredLanguages({ browseScript, browseKind, browseDirection }).length;
  const filtersActive = browseScript !== 'all' || browseKind !== 'all' || browseDirection !== 'all';

  return (
    <section className="space-y-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <SectionHeading>Browse</SectionHeading>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{matchCount} match</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Script</Label>
          <Select value={browseScript} onValueChange={(v) => v && setBrowseScript(v)}>
            <SelectTrigger className="h-9 w-full rounded-none font-mono text-xs">
              <SelectValue placeholder="All scripts" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="all">All scripts</SelectItem>
              {SCRIPTS.map((script) => (
                <SelectItem key={script} value={script}>
                  {script}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Writing type</Label>
          <Select value={browseKind} onValueChange={(v) => v && setBrowseKind(v as typeof browseKind)}>
            <SelectTrigger className="h-9 w-full rounded-none font-mono text-xs">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              {KIND_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Direction</Label>
          <Select value={browseDirection} onValueChange={(v) => v && setBrowseDirection(v as typeof browseDirection)}>
            <SelectTrigger className="h-9 w-full rounded-none font-mono text-xs">
              <SelectValue placeholder="Any direction" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="all">Any direction</SelectItem>
              <SelectItem value="ltr">Left to right</SelectItem>
              <SelectItem value="rtl">Right to left</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" className="rounded-none" onClick={() => pickRandomLanguage()}>
          <Shuffle data-icon="inline-start" />
          Random
        </Button>
        {filtersActive ? (
          <Button type="button" variant="ghost" size="sm" className="rounded-none" onClick={resetBrowseFilters}>
            Clear filters
          </Button>
        ) : null}
      </div>
    </section>
  );
}
