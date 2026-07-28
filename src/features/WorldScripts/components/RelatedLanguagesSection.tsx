import { LANGUAGES } from '../constants';
import { getRelatedByScript } from '../helpers';
import { selectLanguage, useWorldScriptsStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function RelatedLanguagesSection() {
  const selectedId = useWorldScriptsStore((s) => s.selectedId);
  const setSelectedId = useWorldScriptsStore((s) => s.setSelectedId);
  const selected = selectLanguage(selectedId);
  const related = getRelatedByScript(LANGUAGES, selectedId, selected.script).slice(0, 8);

  if (related.length === 0) return null;

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Same script</SectionHeading>
      <p className="font-mono text-[10px] text-muted-foreground">Other languages using {selected.script}</p>
      <ul className="space-y-1">
        {related.map((lang) => (
          <li key={lang.id}>
            <button
              type="button"
              onClick={() => setSelectedId(lang.id)}
              className="flex w-full items-center justify-between gap-2 border border-transparent px-2 py-1.5 text-left text-xs transition-colors hover:border-border hover:bg-muted/40"
            >
              <span className="font-medium">{lang.name}</span>
              <span className="truncate font-mono text-[10px] text-muted-foreground">{lang.native}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
