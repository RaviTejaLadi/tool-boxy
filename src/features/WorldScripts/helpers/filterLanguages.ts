import type { Kind, LanguageEntry } from '../constants';

export type DirectionFilter = 'all' | 'ltr' | 'rtl';
export type KindFilter = 'all' | Kind;
export type ScriptFilter = 'all' | string;

export type LanguageBrowseFilters = {
  script: ScriptFilter;
  kind: KindFilter;
  direction: DirectionFilter;
};

export function filterLanguages(languages: LanguageEntry[], filters: LanguageBrowseFilters): LanguageEntry[] {
  return languages.filter((lang) => {
    if (filters.script !== 'all' && lang.script !== filters.script) return false;
    if (filters.kind !== 'all' && lang.kind !== filters.kind) return false;
    if (filters.direction !== 'all' && lang.direction !== filters.direction) return false;
    return true;
  });
}

export function getUniqueScripts(languages: LanguageEntry[]): string[] {
  return [...new Set(languages.map((l) => l.script))].sort((a, b) => a.localeCompare(b));
}

export function getRelatedByScript(languages: LanguageEntry[], selectedId: string, script: string): LanguageEntry[] {
  return languages.filter((l) => l.script === script && l.id !== selectedId);
}
