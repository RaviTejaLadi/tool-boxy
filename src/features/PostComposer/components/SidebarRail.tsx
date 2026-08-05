// @ts-nocheck — typed gradually
import {
  Copy,
  Layers,
  LayoutTemplate,
  Palette,
  Pencil,
  Plus,
  Shapes,
  Trash2,
  Type,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePanelStore } from '../stores';
import type { PanelId } from '../types';

const PANELS = [
  { id: 'design', label: 'Design', icon: LayoutTemplate },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'shapes', label: 'Shapes', icon: Shapes },
  { id: 'images', label: 'Upload', icon: ImageIcon },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'edit', label: 'Edit', icon: Pencil },
];

export function SidebarRail({ hasSelection }) {
  const activePanel = usePanelStore((s) => s.activePanel);
  const setActivePanel = usePanelStore((s) => s.setActivePanel);

  return (
    <nav className="flex w-14 shrink-0 flex-col items-center gap-0.5 border-r border-border bg-card py-2">
      {PANELS.map((panel) => {
        const Icon = panel.icon;
        const isActive = activePanel === panel.id;
        const showDot = panel.id === 'edit' && hasSelection;
        return (
          <Button
            key={panel.id}
            type="button"
            variant="ghost"
            title={panel.label}
            onClick={() => setActivePanel(panel.id as PanelId)}
            className={cn(
              'relative flex h-14 w-12 flex-col items-center justify-center gap-0.5 rounded-none px-1 font-mono text-[9px] tracking-wide',
              isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isActive && <span className="absolute inset-y-1 left-0 w-0.5 bg-primary" />}
            <Icon className="size-4.5 shrink-0" />
            <span className="leading-none">{panel.label}</span>
            {showDot && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />}
          </Button>
        );
      })}
    </nav>
  );
}

export function SlideToolbarIcons({ onAddSlide, onDuplicate, onDelete, canDelete, slideCount }) {
  return (
    <div className="flex items-center gap-1 border-b border-border px-3 py-2">
      <Layers className="size-3.5 text-muted-foreground" />
      <span className="font-mono text-[10px] text-muted-foreground uppercase">
        {slideCount} slide{slideCount !== 1 ? 's' : ''}
      </span>
      <div className="ml-auto flex items-center gap-0.5">
        <Button type="button" variant="ghost" size="icon" className="size-7" onClick={onAddSlide} title="Add slide">
          <Plus className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onDuplicate}
          title="Duplicate slide"
        >
          <Copy className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive"
          onClick={onDelete}
          disabled={!canDelete}
          title="Delete slide"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
