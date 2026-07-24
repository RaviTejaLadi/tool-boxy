import { useMemo } from 'react';
import { formatCssVarsHex, formatCssVarsOklch, formatTailwindConfig, generateShades } from '../helpers';
import { useShadeStore } from '../stores';
import { CodeBlock } from './CodeBlock';

export function ExportSection() {
  const baseHex = useShadeStore((s) => s.baseHex);
  const mode = useShadeStore((s) => s.mode);
  const colourName = useShadeStore((s) => s.colourName);

  const shades = useMemo(() => generateShades(baseHex, mode), [baseHex, mode]);
  const safeName = colourName.trim() || 'primary';

  const cssVarsHex = useMemo(() => formatCssVarsHex(shades, safeName), [shades, safeName]);
  const cssVarsOklch = useMemo(() => formatCssVarsOklch(shades, safeName), [shades, safeName]);
  const tailwindConfig = useMemo(() => formatTailwindConfig(shades, safeName), [shades, safeName]);

  return (
    <div>
      <p className="mb-2 border-b border-border pb-1 font-mono text-[11px] tracking-wide text-primary">Export</p>
      <div className="flex flex-col gap-4">
        <CodeBlock title="CSS Variables" id="css-hex" code={cssVarsHex} />
        <CodeBlock title="CSS Variables (OKLCH)" id="css-oklch" code={cssVarsOklch} />
        <CodeBlock title="Tailwind Config" id="tw-config" code={tailwindConfig} />
      </div>
    </div>
  );
}
