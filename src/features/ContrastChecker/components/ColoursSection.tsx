import { AlertCircle, ArrowLeftRight, CheckCircle } from 'lucide-react';
import { ColorPickerSwatch } from '@/components/ColorPickerSwatch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getContrastRating } from '../helpers';
import { useContrastCheckerStore, useContrastRatio } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ColoursSection() {
  const background = useContrastCheckerStore((s) => s.background);
  const foreground = useContrastCheckerStore((s) => s.foreground);
  const setBackground = useContrastCheckerStore((s) => s.setBackground);
  const setForeground = useContrastCheckerStore((s) => s.setForeground);
  const flip = useContrastCheckerStore((s) => s.flip);
  const fixToAA = useContrastCheckerStore((s) => s.fixToAA);
  const fixToAAA = useContrastCheckerStore((s) => s.fixToAAA);
  const ratio = useContrastRatio();
  const rating = getContrastRating(ratio);

  const isPassAA = ratio >= 4.5;
  const isPassAALarge = ratio >= 3;
  const isPassAAA = ratio >= 7;
  const isPassAAALarge = ratio >= 4.5;

  const complianceData = [
    { level: 'AA', type: 'Normal text 4.5:1', pass: isPassAA },
    { level: 'AA', type: 'Large text 3:1', pass: isPassAALarge },
    { level: 'AAA', type: 'Normal text 7:1', pass: isPassAAA },
    { level: 'AAA', type: 'Large text 4.5:1', pass: isPassAAALarge },
  ];

  return (
    <>
      <section className="space-y-4">
        <SectionHeading className="mb-3">Colours</SectionHeading>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="bg-input" className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              Background
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="bg-input"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="font-mono uppercase"
              />
              <ColorPickerSwatch
                value={background}
                onChange={setBackground}
                className="size-8"
                ariaLabel="Pick background colour"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fg-input" className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              Foreground
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="fg-input"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="font-mono uppercase"
              />
              <ColorPickerSwatch
                value={foreground}
                onChange={setForeground}
                className="size-8"
                ariaLabel="Pick foreground colour"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={flip}>
            <ArrowLeftRight data-icon="inline-start" />
            Flip
          </Button>
          <Button variant="outline" size="sm" onClick={fixToAA}>
            Fix to AA
          </Button>
          <Button variant="outline" size="sm" onClick={fixToAAA}>
            Fix to AAA
          </Button>
        </div>

        <div className="border border-border bg-muted/30 p-3">
          <div className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Contrast ratio</div>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums">{ratio}:1</span>
            <span className={`text-sm font-medium ${rating.color}`}>{rating.label}</span>
            {isPassAA && <Badge className="bg-green-600">AA</Badge>}
            {isPassAAA && <Badge className="bg-emerald-700">AAA</Badge>}
            {!isPassAA && <Badge variant="destructive">Fail AA</Badge>}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading className="mb-3">WCAG 2.1</SectionHeading>
        <div className="overflow-hidden border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Level</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead className="w-16 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-bold">{item.level}</TableCell>
                  <TableCell className="text-sm">{item.type}</TableCell>
                  <TableCell className="text-center">
                    {item.pass ? (
                      <CheckCircle className="mx-auto size-5 text-green-600" />
                    ) : (
                      <AlertCircle className="mx-auto size-5 text-red-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
