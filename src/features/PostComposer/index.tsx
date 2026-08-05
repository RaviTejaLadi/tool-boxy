// @ts-nocheck — typed gradually
import { useEffect, useState } from 'react';
import { PostComposerHeader, PreviewPane, PostComposerSidebar } from './components';
import { exportAllSlides, exportCanvas } from './helpers';
import { useActiveBackground, useActiveElements, useActiveSlide, useComposerStore } from './stores';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PostComposer() {
  const format = useComposerStore((s) => s.format);
  const slides = useComposerStore((s) => s.slides);
  const projectName = useComposerStore((s) => s.projectName);
  const background = useActiveBackground();
  const elements = useActiveElements();
  const activeSlide = useActiveSlide();
  const selectedId = useComposerStore((s) => s.selectedId);
  const editingTextId = useComposerStore((s) => s.editingTextId);
  const undo = useComposerStore((s) => s.undo);
  const redo = useComposerStore((s) => s.redo);
  const deleteSelected = useComposerStore((s) => s.deleteSelected);
  const setHydrated = useComposerStore((s) => s.setHydrated);

  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (editingTextId) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        deleteSelected();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingTextId, selectedId, undo, redo, deleteSelected]);

  const safeName =
    (projectName || 'post')
      .trim()
      .replace(/[^a-z0-9-_]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'post';

  const handleExportCurrent = async () => {
    setExporting(true);
    try {
      const blob = await exportCanvas(format, background, elements);
      if (!blob) return;
      const slideName = activeSlide?.name?.replace(/[^a-z0-9-_]+/gi, '-') || 'slide';
      downloadBlob(blob, `${safeName}-${slideName}.png`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const blobs = await exportAllSlides(
        format,
        slides.map((s) => ({ name: s.name, background: s.background, elements: s.elements }))
      );
      if (blobs.length === 1) {
        downloadBlob(blobs[0].blob, `${safeName}-${blobs[0].name}`);
        return;
      }
      for (const { name, blob } of blobs) {
        downloadBlob(blob, `${safeName}-${name.replace(/[^a-z0-9-_]+/gi, '-')}.png`);
        await new Promise((r) => setTimeout(r, 200));
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <PostComposerHeader onExportCurrent={handleExportCurrent} onExportAll={handleExportAll} exporting={exporting} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <PostComposerSidebar />
      </div>
    </div>
  );
}
