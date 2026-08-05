// @ts-nocheck — typed gradually
import { Button } from '@/components/ui/button';
import { DEFAULT_SHAPE_FILL, SHAPE_CATEGORIES } from '../constants';
import { useComposerStore } from '../stores';
import { SectionHeading } from './SectionHeading';
import { ShapePreview } from './ShapePreview';

export function ShapesSection() {
  const addShape = useComposerStore((s) => s.addShape);

  return (
    <section className="space-y-5">
      <div>
        <SectionHeading className="mb-3">Shapes</SectionHeading>
        <p className="text-xs text-muted-foreground">
          Add shapes to your slide. Customize fill and size in the Edit panel.
        </p>
      </div>
      {SHAPE_CATEGORIES.map((category) => (
        <div key={category.id}>
          <p className="mb-2 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">{category.label}</p>
          <div className="grid grid-cols-3 gap-2">
            {category.shapes.map((shape) => (
              <Button
                key={shape.id}
                type="button"
                variant="outline"
                onClick={() => addShape(shape.id)}
                className="flex h-auto flex-col items-center gap-1.5 py-2.5"
              >
                <div
                  className="flex size-9 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${DEFAULT_SHAPE_FILL}18` }}
                >
                  <ShapePreview shapeType={shape.id} />
                </div>
                <span className="text-center text-[9px] leading-tight text-muted-foreground">{shape.label}</span>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
