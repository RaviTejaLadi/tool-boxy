import { Check, Copy } from 'lucide-react';
import { ColorPickerSwatch } from '@/components/ColorPickerSwatch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FORMAT_EXAMPLES } from '../helpers';
import { useColourConverterStore, useColourFormats } from '../stores';
import { SectionHeading } from './SectionHeading';

export function FormatsSection() {
  const hex = useColourConverterStore((s) => s.hex);
  const copied = useColourConverterStore((s) => s.copied);
  const setHex = useColourConverterStore((s) => s.setHex);
  const copyValue = useColourConverterStore((s) => s.copyValue);
  const allFormats = useColourFormats();

  return (
    <>
      <section className="space-y-4">
        <SectionHeading className="mb-3">Input</SectionHeading>
        <div className="space-y-2">
          <Label htmlFor="hex-input" className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            HEX
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="hex-input"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="font-mono uppercase"
              placeholder="#000000"
            />
            <ColorPickerSwatch value={hex} onChange={setHex} className="size-8" ariaLabel="Pick colour" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading className="mb-3">All formats</SectionHeading>
        <div className="overflow-hidden border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28 font-mono text-[10px] uppercase">Format</TableHead>
                <TableHead className="font-mono text-[10px] uppercase">Value</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFormats.map((item) => (
                <TableRow key={item.format}>
                  <TableCell className="font-medium">{item.format}</TableCell>
                  <TableCell className="font-mono text-xs">{item.value}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => void copyValue(item.value, item.format)}
                    >
                      {copied === item.format ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading className="mb-3">Examples</SectionHeading>
        <div className="overflow-hidden border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono text-[10px] uppercase">Format</TableHead>
                <TableHead className="font-mono text-[10px] uppercase">HEX</TableHead>
                <TableHead className="font-mono text-[10px] uppercase">RGB</TableHead>
                <TableHead className="font-mono text-[10px] uppercase">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FORMAT_EXAMPLES.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.format}</TableCell>
                  <TableCell className="font-mono text-xs">{item.hex}</TableCell>
                  <TableCell className="font-mono text-xs">{item.rgb}</TableCell>
                  <TableCell className="font-mono text-xs">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
