// @ts-nocheck — typed gradually
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useComposerStore } from '../stores';

function SlideThumb({ slide, format, isActive, index, onClick }) {
  const scale = 64 / Math.max(format.w, format.h);
  const thumbW = format.w * scale;
  const thumbH = format.h * scale;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative shrink-0 overflow-hidden rounded-md border-2 transition-all',
        isActive ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-ring'
      )}
      style={{ width: thumbW + 8, height: thumbH + 24 }}
    >
      <div
        className="relative mx-auto mt-1 overflow-hidden rounded-sm shadow-sm"
        style={{
          width: thumbW,
          height: thumbH,
          backgroundColor: slide.background.type === 'color' ? slide.background.value : undefined,
          backgroundImage: slide.background.type === 'gradient' ? slide.background.value : undefined,
        }}
      >
        {slide.elements.slice(0, 3).map((el) => {
          if (el.type === 'text') {
            return (
              <div
                key={el.id}
                className="absolute truncate"
                style={{
                  left: el.x * scale,
                  top: el.y * scale,
                  fontSize: Math.max(4, el.fontSize * scale * 0.5),
                  color: el.color,
                  fontWeight: el.fontWeight,
                }}
              >
                {el.text.split('\n')[0]?.slice(0, 12)}
              </div>
            );
          }
          if (el.type === 'shape') {
            return (
              <div
                key={el.id}
                className="absolute"
                style={{
                  left: el.x * scale,
                  top: el.y * scale,
                  width: el.width * scale,
                  height: el.height * scale,
                  backgroundColor: el.fill,
                  opacity: el.opacity ?? 1,
                  borderRadius: el.shapeType === 'circle' ? '9999px' : 2,
                }}
              />
            );
          }
          return null;
        })}
      </div>
      <span className="absolute inset-x-0 bottom-0.5 text-center font-mono text-[9px] text-muted-foreground">
        {index + 1}
      </span>
    </button>
  );
}

export function SlideStrip() {
  const slides = useComposerStore((s) => s.slides);
  const activeSlideId = useComposerStore((s) => s.activeSlideId);
  const format = useComposerStore((s) => s.format);
  const setActiveSlide = useComposerStore((s) => s.setActiveSlide);
  const addBlankSlide = useComposerStore((s) => s.addBlankSlide);

  return (
    <div className="shrink-0 border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 overflow-x-auto px-3 py-2.5">
        {slides.map((slide, index) => (
          <SlideThumb
            key={slide.id}
            slide={slide}
            format={format}
            index={index}
            isActive={slide.id === activeSlideId}
            onClick={() => setActiveSlide(slide.id)}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addBlankSlide}
          className="flex h-[88px] w-16 shrink-0 flex-col items-center justify-center gap-1 border-dashed font-mono text-[9px] text-muted-foreground"
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
