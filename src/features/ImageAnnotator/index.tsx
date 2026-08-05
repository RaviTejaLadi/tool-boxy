import { useCallback, useRef, type ChangeEvent } from 'react';
import { ImageAnnotatorHeader, ImageAnnotatorSidebar, PreviewPane } from './components';
import { exportAnnotatedImage, readImageFile } from './helpers';
import { useAnnotatorStore, selectAnnotations } from './stores';

export default function ImageAnnotator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const image = useAnnotatorStore((s) => s.image);
  const fileName = useAnnotatorStore((s) => s.fileName);
  const exportFormat = useAnnotatorStore((s) => s.exportFormat);
  const exportQuality = useAnnotatorStore((s) => s.exportQuality);
  const annotations = useAnnotatorStore(selectAnnotations);
  const loadImage = useAnnotatorStore((s) => s.loadImage);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDownload = useCallback(() => {
    if (!image) return;
    exportAnnotatedImage(image, annotations, {
      fileName,
      format: exportFormat,
      quality: exportQuality,
    });
  }, [annotations, exportFormat, exportQuality, fileName, image]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readImageFile(file, (img, meta) => loadImage(img, meta));
    e.target.value = '';
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ImageAnnotatorHeader onUpload={handleUploadClick} onDownload={handleDownload} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane fileInputRef={fileInputRef} />
        <ImageAnnotatorSidebar />
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
    </div>
  );
}
