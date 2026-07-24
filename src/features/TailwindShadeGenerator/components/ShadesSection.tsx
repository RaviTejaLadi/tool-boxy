import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generateShades } from '../helpers';
import { useShadeStore } from '../stores';
import { CopyButton } from './CopyButton';

export function ShadesSection() {
  const baseHex = useShadeStore((s) => s.baseHex);
  const mode = useShadeStore((s) => s.mode);
  const shades = useMemo(() => generateShades(baseHex, mode), [baseHex, mode]);

  return (
    <div>
      <p className="mb-2 border-b border-border pb-1 font-mono text-[11px] tracking-wide text-primary">
        Generated Shades
      </p>
      <div className="border border-border bg-card p-4">
        <div className="mb-4 flex h-16 overflow-hidden border border-border">
          {shades.map((s) => (
            <div key={s.step} className="flex-1" style={{ backgroundColor: s.hex }} title={`${s.step}: ${s.hex}`} />
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Step</TableHead>
              <TableHead />
              <TableHead>Hex</TableHead>
              <TableHead className="w-10 text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {shades.map((s) => (
              <TableRow key={s.step}>
                <TableCell className="w-16 font-mono text-sm font-semibold">{s.step}</TableCell>
                <TableCell className="w-16">
                  <div className="h-6 w-10 border border-border" style={{ backgroundColor: s.hex }} />
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{s.hex}</TableCell>
                <TableCell className="text-right">
                  <CopyButton text={s.hex} id={`row-${s.step}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
