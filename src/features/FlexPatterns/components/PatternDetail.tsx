import { useMemo } from 'react';
import { buildFlexboxCss, buildFlexboxHtml } from '../helpers';
import { getActivePattern, useFlexPatternsStore } from '../stores';
import { CodeBlock } from './CodeBlock';
import { CopyButton } from './CopyButton';
import { PreviewStage } from './PatternPreview';

export function PatternDetail() {
  const activePatternId = useFlexPatternsStore((s) => s.activePatternId);
  const pattern = getActivePattern(activePatternId);

  const cssText = useMemo(
    () =>
      buildFlexboxCss({
        container: pattern.container,
        items: pattern.items,
      }),
    [pattern]
  );

  const htmlText = useMemo(() => buildFlexboxHtml(pattern.items), [pattern.items]);

  const fullSnippet = useMemo(
    () => `<!-- ${pattern.name} -->\n${htmlText}\n\n<style>\n${cssText}\n</style>`,
    [pattern.name, htmlText, cssText]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 lg:px-6">
        <h2 className="min-w-0 truncate font-heading text-lg font-semibold">{pattern.name}</h2>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
          <CopyButton text={fullSnippet} id={`${pattern.id}-all`} label="Copy all" />
          <CopyButton text={cssText} id={`${pattern.id}-css`} label="Copy CSS" />
          <CopyButton text={htmlText} id={`${pattern.id}-html`} label="Copy HTML" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="space-y-4 p-4 lg:p-6">
          <section className="space-y-2">
            <p className="font-mono text-[11px] tracking-wide text-primary uppercase">Live preview</p>
            <PreviewStage pattern={pattern} />
          </section>

          <section className="space-y-3">
            <p className="font-mono text-[11px] tracking-wide text-primary uppercase">Production code</p>
            <CodeBlock title="HTML" id={`${pattern.id}-html-block`} code={htmlText} />
            <CodeBlock title="CSS" id={`${pattern.id}-css-block`} code={cssText} />
          </section>
        </div>
      </div>
    </div>
  );
}
