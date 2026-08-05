// @ts-nocheck — typed gradually
import { Download, ImageDown, LayoutTemplate, Redo2, RotateCcw, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useComposerStore } from '../stores';

export function PostComposerHeader({ onExportCurrent, onExportAll, exporting }) {
  const projectName = useComposerStore((s) => s.projectName);
  const setProjectName = useComposerStore((s) => s.setProjectName);
  const slides = useComposerStore((s) => s.slides);
  const canUndo = useComposerStore((s) => Boolean(s.historyBySlide[s.activeSlideId]?.past?.length));
  const canRedo = useComposerStore((s) => Boolean(s.historyBySlide[s.activeSlideId]?.future?.length));
  const undo = useComposerStore((s) => s.undo);
  const redo = useComposerStore((s) => s.redo);
  const clearProject = useComposerStore((s) => s.clearProject);

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 lg:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground">
          <LayoutTemplate className="size-4" />
        </div>
        <div className="min-w-0">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="h-7 border-0 bg-transparent px-0 font-heading text-sm font-semibold shadow-none focus-visible:ring-0"
          />
          <div className="font-mono text-[11px] leading-none text-muted-foreground">
            {slides.length} slide{slides.length !== 1 ? 's' : ''} · Auto-saved locally
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="icon" className="size-8" disabled={!canUndo} onClick={undo} title="Undo">
          <Undo2 className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="size-8" disabled={!canRedo} onClick={redo} title="Redo">
          <Redo2 className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8 hidden sm:flex"
          onClick={clearProject}
          title="Reset project"
        >
          <RotateCcw className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" disabled={exporting}>
              <ImageDown data-icon="inline-start" />
              {exporting ? 'Exporting…' : 'Export'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportCurrent}>
              <Download className="size-4" />
              Current slide (PNG)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportAll}>
              <Download className="size-4" />
              All slides ({slides.length} PNGs)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
