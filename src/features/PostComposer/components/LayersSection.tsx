// @ts-nocheck — typed gradually
import { Circle, Image as ImageIcon, Minus, Square, Star, Triangle, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useActiveElements, useComposerStore, usePanelStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const shapeIcon = (shapeType) => {
  switch (shapeType) {
    case 'circle':
      return Circle;
    case 'triangle':
      return Triangle;
    case 'line':
      return Minus;
    case 'star':
      return Star;
    default:
      return Square;
  }
};

export function LayersSection() {
  const elements = useActiveElements();
  const selectedId = useComposerStore((s) => s.selectedId);
  const setSelectedId = useComposerStore((s) => s.setSelectedId);
  const setActivePanel = usePanelStore((s) => s.setActivePanel);

  const selectLayer = (id) => {
    setSelectedId(id);
    setActivePanel('edit');
  };

  return (
    <section>
      <SectionHeading className="mb-3">Layers</SectionHeading>
      <div className="space-y-1">
        {[...elements].reverse().map((el) => {
          const ShapeIcon = el.type === 'shape' ? shapeIcon(el.shapeType) : null;
          return (
            <Button
              key={el.id}
              type="button"
              variant="ghost"
              onClick={() => selectLayer(el.id)}
              className={cn(
                'h-auto w-full justify-start gap-2 px-2 py-1.5 font-mono text-xs',
                selectedId === el.id && 'bg-muted text-foreground'
              )}
            >
              {el.type === 'text' && <Type className="size-3 shrink-0" />}
              {el.type === 'image' && <ImageIcon className="size-3 shrink-0" />}
              {el.type === 'shape' && ShapeIcon && <ShapeIcon className="size-3 shrink-0" />}
              <span className="truncate">
                {el.type === 'text' ? el.text.split('\n')[0] || 'Text' : el.type === 'image' ? 'Image' : el.shapeType}
              </span>
            </Button>
          );
        })}
        {!elements.length && <p className="text-xs text-muted-foreground">No elements on this slide yet.</p>}
      </div>
    </section>
  );
}
