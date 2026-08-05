import { useCallback, useRef, useState, type ChangeEvent } from 'react';
import { DocumentAnnotatorHeader, DocumentAnnotatorSidebar, PreviewPane } from './components';
import { exportAnnotatedDocument, readDocumentFile } from './helpers';
import { useAnnotatorStore, selectAnnotations } from './stores';

export default function DocumentAnnotator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);

  const image = useAnnotatorStore((s) => s.image);
  const fileName = useAnnotatorStore((s) => s.fileName);
  const exportFormat = useAnnotatorStore((s) => s.exportFormat);
  const exportQuality = useAnnotatorStore((s) => s.exportQuality);
  const sourceKind = useAnnotatorStore((s) => s.sourceKind);
  const pdfData = useAnnotatorStore((s) => s.pdfData);
  const numPages = useAnnotatorStore((s) => s.numPages);
  const pageNumber = useAnnotatorStore((s) => s.pageNumber);
  const pageStates = useAnnotatorStore((s) => s.pageStates);
  const history = useAnnotatorStore((s) => s.history);
  const historyIndex = useAnnotatorStore((s) => s.historyIndex);
  const annotations = useAnnotatorStore(selectAnnotations);
  const loadDocument = useAnnotatorStore((s) => s.loadDocument);
  const setLoading = useAnnotatorStore((s) => s.setLoading);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDownload = useCallback(async () => {
    if (!image || exporting) return;
    setExporting(true);
    try {
      await exportAnnotatedDocument({
        fileName,
        format: exportFormat,
        quality: exportQuality,
        image,
        annotations,
        sourceKind,
        pdfData,
        numPages,
        pageNumber,
        pageStates,
        history,
        historyIndex,
      });
    } finally {
      setExporting(false);
    }
  }, [
    annotations,
    exportFormat,
    exportQuality,
    exporting,
    fileName,
    history,
    historyIndex,
    image,
    numPages,
    pageNumber,
    pageStates,
    pdfData,
    sourceKind,
  ]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = '';
      return;
    }
    setLoading(true);
    void readDocumentFile(file)
      .then((loaded) => {
        if (!loaded) {
          setLoading(false);
          return;
        }
        loadDocument(
          loaded.image,
          loaded.meta,
          loaded.pdfData && loaded.numPages ? { data: loaded.pdfData, numPages: loaded.numPages } : undefined
        );
      })
      .catch(() => setLoading(false));
    e.target.value = '';
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <DocumentAnnotatorHeader onUpload={handleUploadClick} onDownload={handleDownload} exporting={exporting} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane fileInputRef={fileInputRef} />
        <DocumentAnnotatorSidebar />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,.pdf"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
