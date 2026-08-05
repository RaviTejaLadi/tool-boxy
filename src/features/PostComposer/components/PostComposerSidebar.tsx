// @ts-nocheck — typed gradually
import { ScrollArea } from '@/components/ui/scroll-area';
import { useComposerStore, usePanelStore } from '../stores';
import { BackgroundSection } from './BackgroundSection';
import { ImagesSection } from './ImagesSection';
import { InspectorSection } from './InspectorSection';
import { LayersSection } from './LayersSection';
import { PresetsSection } from './PresetsSection';
import { ShapesSection } from './ShapesSection';
import { SidebarRail, SlideToolbarIcons } from './SidebarRail';
import { TextSection } from './TextSection';

function PanelContent() {
  const activePanel = usePanelStore((s) => s.activePanel);

  switch (activePanel) {
    case 'design':
      return (
        <>
          <PresetsSection />
          <LayersSection />
        </>
      );
    case 'text':
      return <TextSection />;
    case 'shapes':
      return <ShapesSection />;
    case 'images':
      return <ImagesSection />;
    case 'background':
      return <BackgroundSection />;
    case 'edit':
      return (
        <>
          <InspectorSection />
          <LayersSection />
        </>
      );
    default:
      return null;
  }
}

export function PostComposerSidebar() {
  const selectedId = useComposerStore((s) => s.selectedId);
  const slides = useComposerStore((s) => s.slides);
  const activeSlideId = useComposerStore((s) => s.activeSlideId);
  const addBlankSlide = useComposerStore((s) => s.addBlankSlide);
  const duplicateSlide = useComposerStore((s) => s.duplicateSlide);
  const deleteSlide = useComposerStore((s) => s.deleteSlide);

  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-[420px] lg:min-h-0 lg:border-t-0 lg:border-l">
      <SidebarRail hasSelection={Boolean(selectedId)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <SlideToolbarIcons
          slideCount={slides.length}
          canDelete={slides.length > 1}
          onAddSlide={addBlankSlide}
          onDuplicate={() => duplicateSlide(activeSlideId)}
          onDelete={() => deleteSlide(activeSlideId)}
        />
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 p-4">
            <PanelContent />
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
