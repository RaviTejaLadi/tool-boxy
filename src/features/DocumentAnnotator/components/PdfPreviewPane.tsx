import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent,
  type RefObject,
} from 'react';
import { Document, Page } from 'react-pdf';
import { ImageOff, Upload } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { HANDLE_PX, HIT_PAD_PX, TOOL_SHORTCUTS } from '../constants';
import { boundsOf, drawAnnotation, hitTest, norm, readDocumentFile, renderPdfPage, uid } from '../helpers';
import { useAnnotatorStore, selectAnnotations } from '../stores';
import type {
  Annotation,
  CalloutAnnotation,
  DragState,
  PathAnnotation,
  Point,
  ShapeAnnotation,
  TextAnnotation,
} from '../types';
import { ensurePdfWorker } from '../../PDFViewer/helpers';

ensurePdfWorker();

function isTypingTarget(el: EventTarget | null) {
  const tag = (el as HTMLElement | null)?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA';
}

type PageSize = { width: number; height: number };

export function PdfPreviewPane({ fileInputRef }: { fileInputRef: RefObject<HTMLInputElement | null> }) {
  const pdfFile = useAnnotatorStore((s) => s.pdfFile);
  const pdfData = useAnnotatorStore((s) => s.pdfData);
  const numPages = useAnnotatorStore((s) => s.numPages);
  const pageNumber = useAnnotatorStore((s) => s.pageNumber);
  const pageStates = useAnnotatorStore((s) => s.pageStates);
  const isLoading = useAnnotatorStore((s) => s.isLoading);
  const tool = useAnnotatorStore((s) => s.tool);
  const color = useAnnotatorStore((s) => s.color);
  const strokeWidth = useAnnotatorStore((s) => s.strokeWidth);
  const fontSize = useAnnotatorStore((s) => s.fontSize);
  const opacity = useAnnotatorStore((s) => s.opacity);
  const filled = useAnnotatorStore((s) => s.filled);
  const dashed = useAnnotatorStore((s) => s.dashed);
  const selectedId = useAnnotatorStore((s) => s.selectedId);
  const zoom = useAnnotatorStore((s) => s.zoom);
  const showShortcuts = useAnnotatorStore((s) => s.showShortcuts);
  const annotations = useAnnotatorStore(selectAnnotations);
  const loadDocument = useAnnotatorStore((s) => s.loadDocument);
  const setLoading = useAnnotatorStore((s) => s.setLoading);
  const setPage = useAnnotatorStore((s) => s.setPage);
  const setNumPages = useAnnotatorStore((s) => s.setNumPages);
  const commit = useAnnotatorStore((s) => s.commit);
  const undo = useAnnotatorStore((s) => s.undo);
  const redo = useAnnotatorStore((s) => s.redo);
  const setTool = useAnnotatorStore((s) => s.setTool);
  const setSelectedId = useAnnotatorStore((s) => s.setSelectedId);
  const setShowShortcuts = useAnnotatorStore((s) => s.setShowShortcuts);
  const deleteSelected = useAnnotatorStore((s) => s.deleteSelected);
  const duplicateSelected = useAnnotatorStore((s) => s.duplicateSelected);
  const takeCalloutNumber = useAnnotatorStore((s) => s.takeCalloutNumber);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pageElementMapRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const overlayCanvasMapRef = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [pageSizes, setPageSizes] = useState<Record<number, PageSize>>({});
  const [pageImageCache, setPageImageCache] = useState<Record<number, HTMLImageElement>>({});
  const [draft, setDraft] = useState<Annotation | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragPreview, setDragPreview] = useState<Annotation | null>(null);
  const [textEdit, setTextEdit] = useState<{ id: string | null; x: number; y: number; value: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [panDrag, setPanDrag] = useState<{ startClient: Point; startScroll: Point } | null>(null);

  const styleBase = useMemo(() => ({ color, strokeWidth, opacity, dashed }), [color, strokeWidth, opacity, dashed]);
  const fileSignature = useMemo(
    () => (pdfFile ? `${pdfFile.name}:${pdfFile.size}:${pdfFile.lastModified}` : ''),
    [pdfFile]
  );
  const allPages = useMemo(() => Array.from({ length: Math.max(1, numPages) }, (_, i) => i + 1), [numPages]);

  const annotationsForPage = useCallback(
    (page: number) => {
      if (page === pageNumber) return annotations;
      const pageState = pageStates[page];
      return pageState?.history[pageState.historyIndex] ?? [];
    },
    [annotations, pageNumber, pageStates]
  );

  const loadDocumentFile = useCallback(
    (file: File) => {
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
            loaded.pdfData && loaded.numPages && loaded.pdfFile
              ? { file: loaded.pdfFile, data: loaded.pdfData, numPages: loaded.numPages }
              : undefined
          );
        })
        .catch(() => setLoading(false));
    },
    [loadDocument, setLoading]
  );

  const ensurePageImage = useCallback(
    (page: number) => {
      if (!pdfData || pageImageCache[page]) return;
      // Use scale=1 so redact coordinates map exactly to overlay coordinates.
      void renderPdfPage(pdfData, page, 1)
        .then((image) => {
          setPageImageCache((current) => (current[page] ? current : { ...current, [page]: image }));
        })
        .catch(() => {
          /* keep fallback fill for this page */
        });
    },
    [pageImageCache, pdfData]
  );

  useEffect(() => {
    setPageImageCache({});
  }, [fileSignature, pdfData]);

  useEffect(() => {
    ensurePageImage(pageNumber);
  }, [ensurePageImage, pageNumber]);

  useEffect(() => {
    if (!pdfFile) return;
    const activePage = pageElementMapRef.current.get(pageNumber);
    if (activePage) {
      activePage.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
  }, [pageNumber, pdfFile]);

  useEffect(() => {
    setDraft(null);
    setDragState(null);
    setDragPreview(null);
    setTextEdit(null);
  }, [pageNumber]);

  useEffect(() => {
    if (!textEdit) return;
    const id = window.requestAnimationFrame(() => {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    });
    return () => window.cancelAnimationFrame(id);
  }, [textEdit]);

  const renderList = useMemo(() => {
    const list = annotations
      .filter((a) => !(textEdit && a.id === textEdit.id))
      .map((a) => (dragPreview && a.id === dragPreview.id ? dragPreview : a));
    if (draft) list.push(draft);
    return list;
  }, [annotations, dragPreview, draft, textEdit]);

  const drawPageOverlay = useCallback(
    (page: number, marks: Annotation[], highlightSelection: boolean) => {
      const dpr = window.devicePixelRatio || 1;
      const canvas = overlayCanvasMapRef.current.get(page);
      const pageSize = pageSizes[page];
      if (!canvas || !pageSize) return;

      const widthPx = Math.max(1, Math.round(pageSize.width * zoom));
      const heightPx = Math.max(1, Math.round(pageSize.height * zoom));
      canvas.width = widthPx * dpr;
      canvas.height = heightPx * dpr;
      canvas.style.width = `${widthPx}px`;
      canvas.style.height = `${heightPx}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, widthPx, heightPx);

      const sx = widthPx / pageSize.width;
      const sy = heightPx / pageSize.height;
      const scaleAvg = (sx + sy) / 2;

      if (marks.some((a) => a.type === 'redact') && !pageImageCache[page]) {
        ensurePageImage(page);
      }
      const pageImage = pageImageCache[page] ?? null;

      ctx.save();
      ctx.scale(sx, sy);
      for (const annotation of marks) {
        drawAnnotation(ctx, annotation, pageImage);
      }

      if (highlightSelection) {
        const selected = marks.find((a) => a.id === selectedId);
        if (selected) {
          const b = boundsOf(selected);
          const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3b82f6';
          ctx.save();
          ctx.strokeStyle = primary;
          ctx.lineWidth = 1.5 / scaleAvg;
          ctx.setLineDash([5 / scaleAvg, 4 / scaleAvg]);
          ctx.strokeRect(b.x - 4 / scaleAvg, b.y - 4 / scaleAvg, b.w + 8 / scaleAvg, b.h + 8 / scaleAvg);
          ctx.setLineDash([]);

          const handleSize = HANDLE_PX / scaleAvg;
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = primary;
          ctx.lineWidth = 1.5 / scaleAvg;
          const drawHandle = (hx: number, hy: number) => {
            ctx.beginPath();
            ctx.rect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
            ctx.fill();
            ctx.stroke();
          };

          if (
            selected.type === 'rect' ||
            selected.type === 'highlight' ||
            selected.type === 'ellipse' ||
            selected.type === 'redact' ||
            selected.type === 'mask'
          ) {
            drawHandle(b.x, b.y);
            drawHandle(b.x + b.w, b.y);
            drawHandle(b.x, b.y + b.h);
            drawHandle(b.x + b.w, b.y + b.h);
          } else if (selected.type === 'line' || selected.type === 'arrow') {
            drawHandle(selected.points[0].x, selected.points[0].y);
            drawHandle(selected.points[1].x, selected.points[1].y);
          }
          ctx.restore();
        }
      }

      ctx.restore();
    },
    [ensurePageImage, pageImageCache, pageSizes, selectedId, zoom]
  );

  useEffect(() => {
    drawPageOverlay(pageNumber, renderList, true);
  }, [drawPageOverlay, pageNumber, renderList]);

  useEffect(() => {
    for (const page of allPages) {
      if (page === pageNumber) continue;
      drawPageOverlay(page, annotationsForPage(page), false);
    }
  }, [allPages, annotationsForPage, drawPageOverlay, pageNumber]);

  const getPointerGeometry = useCallback(() => {
    const canvas = overlayCanvasMapRef.current.get(pageNumber);
    const pageSize = pageSizes[pageNumber];
    if (!canvas || !pageSize) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const sx = rect.width / pageSize.width;
    const sy = rect.height / pageSize.height;
    const scaleAvg = (sx + sy) / 2;
    return { canvas, pageSize, rect, sx, sy, scaleAvg };
  }, [pageNumber, pageSizes]);

  const screenToPage = useCallback(
    (clientX: number, clientY: number): Point => {
      const geometry = getPointerGeometry();
      if (!geometry) return { x: 0, y: 0 };
      return {
        x: (clientX - geometry.rect.left) / geometry.sx,
        y: (clientY - geometry.rect.top) / geometry.sy,
      };
    },
    [getPointerGeometry]
  );

  const findAnnotationAt = useCallback(
    (pt: Point): Annotation | null => {
      const geometry = getPointerGeometry();
      const hitPad = geometry ? HIT_PAD_PX / geometry.scaleAvg : HIT_PAD_PX;
      for (let i = annotations.length - 1; i >= 0; i--) {
        if (hitTest(pt, annotations[i], hitPad)) return annotations[i];
      }
      return null;
    },
    [annotations, getPointerGeometry]
  );

  const findHandleAt = useCallback(
    (pt: Point, a: Annotation): string | null => {
      const geometry = getPointerGeometry();
      const handleSize = geometry ? HANDLE_PX / geometry.scaleAvg : HANDLE_PX;
      const b = boundsOf(a);
      const near = (hx: number, hy: number) => Math.abs(pt.x - hx) <= handleSize && Math.abs(pt.y - hy) <= handleSize;
      if (
        a.type === 'rect' ||
        a.type === 'highlight' ||
        a.type === 'ellipse' ||
        a.type === 'redact' ||
        a.type === 'mask'
      ) {
        if (near(b.x, b.y)) return 'tl';
        if (near(b.x + b.w, b.y)) return 'tr';
        if (near(b.x, b.y + b.h)) return 'bl';
        if (near(b.x + b.w, b.y + b.h)) return 'br';
      } else if (a.type === 'line' || a.type === 'arrow') {
        if (near(a.points[0].x, a.points[0].y)) return 'p0';
        if (near(a.points[1].x, a.points[1].y)) return 'p1';
      }
      return null;
    },
    [getPointerGeometry]
  );

  const commitTextEdit = useCallback(() => {
    setTextEdit((te) => {
      if (!te) return null;
      const nextText = te.value;
      if (te.id) {
        if (nextText.trim().length === 0) {
          commit(annotations.filter((a) => a.id !== te.id));
          if (selectedId === te.id) setSelectedId(null);
        } else {
          commit(annotations.map((a) => (a.id === te.id && a.type === 'text' ? { ...a, text: nextText } : a)));
        }
      } else if (nextText.trim().length > 0) {
        const textAnnotation: TextAnnotation = {
          id: uid(),
          type: 'text',
          x: te.x,
          y: te.y,
          text: nextText,
          fontSize,
          color: styleBase.color,
          strokeWidth: styleBase.strokeWidth,
          opacity: styleBase.opacity,
          dashed: false,
        };
        commit([...annotations, textAnnotation]);
        setSelectedId(textAnnotation.id);
      }
      return null;
    });
  }, [annotations, commit, fontSize, selectedId, setSelectedId, styleBase]);

  const startTextEdit = useCallback(
    (pt: Point, existing?: TextAnnotation) => {
      if (existing) {
        setTextEdit({ id: existing.id, x: existing.x, y: existing.y, value: existing.text });
        setSelectedId(existing.id);
        return;
      }
      setTextEdit({ id: null, x: pt.x, y: pt.y, value: '' });
    },
    [setSelectedId]
  );

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const host = pageElementMapRef.current.get(pageNumber);
    if (!host) return;
    void setPage(pageNumber);
    const pt = screenToPage(e.clientX, e.clientY);

    if (tool === 'text') {
      if (textEdit) commitTextEdit();
      startTextEdit(pt);
      return;
    }

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (tool === 'pan' || spaceHeld) {
      const container = scrollRef.current;
      if (!container) return;
      setPanDrag({
        startClient: { x: e.clientX, y: e.clientY },
        startScroll: { x: container.scrollLeft, y: container.scrollTop },
      });
      return;
    }

    if (tool === 'callout') {
      const callout: CalloutAnnotation = {
        id: uid(),
        type: 'callout',
        x: pt.x,
        y: pt.y,
        number: takeCalloutNumber(),
        fontSize,
        color: styleBase.color,
        strokeWidth: styleBase.strokeWidth,
        opacity: styleBase.opacity,
        dashed: false,
      };
      commit([...annotations, callout]);
      setSelectedId(callout.id);
      return;
    }

    if (tool === 'eraser') {
      const hit = findAnnotationAt(pt);
      if (hit) {
        commit(annotations.filter((a) => a.id !== hit.id));
        if (selectedId === hit.id) setSelectedId(null);
      }
      return;
    }

    if (tool === 'select') {
      const selected = annotations.find((a) => a.id === selectedId);
      if (selected) {
        const handle = findHandleAt(pt, selected);
        if (handle) {
          setDragState({
            mode: handle.startsWith('p') ? 'endpoint' : 'resize',
            handle,
            originId: selected.id,
            startImg: pt,
            original: selected,
          });
          return;
        }
      }
      const hit = findAnnotationAt(pt);
      if (hit) {
        setSelectedId(hit.id);
        setDragState({
          mode: 'move',
          originId: hit.id,
          startImg: pt,
          original: hit,
        });
      } else {
        setSelectedId(null);
      }
      return;
    }

    setSelectedId(null);
    const base = { id: uid(), ...styleBase };
    if (tool === 'rect' || tool === 'ellipse') {
      setDraft({ ...base, type: tool, x: pt.x, y: pt.y, w: 0, h: 0, filled });
    } else if (tool === 'highlight' || tool === 'redact' || tool === 'mask') {
      setDraft({ ...base, type: tool, x: pt.x, y: pt.y, w: 0, h: 0, filled: true });
    } else if (tool === 'line' || tool === 'arrow') {
      setDraft({ ...base, type: tool, points: [pt, pt] });
    } else if (tool === 'pen') {
      setDraft({ ...base, type: 'pen', points: [pt] });
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (panDrag) {
      const container = scrollRef.current;
      if (!container) return;
      container.scrollLeft = panDrag.startScroll.x - (e.clientX - panDrag.startClient.x);
      container.scrollTop = panDrag.startScroll.y - (e.clientY - panDrag.startClient.y);
      return;
    }

    const pt = screenToPage(e.clientX, e.clientY);

    if (tool === 'eraser' && e.buttons === 1) {
      const hit = findAnnotationAt(pt);
      if (hit) {
        commit(annotations.filter((a) => a.id !== hit.id));
        if (selectedId === hit.id) setSelectedId(null);
      }
      return;
    }

    if (dragState) {
      const orig = dragState.original;
      if (dragState.mode === 'move') {
        const dx = pt.x - dragState.startImg.x;
        const dy = pt.y - dragState.startImg.y;
        let updated: Annotation;
        if (
          orig.type === 'rect' ||
          orig.type === 'highlight' ||
          orig.type === 'ellipse' ||
          orig.type === 'redact' ||
          orig.type === 'mask'
        ) {
          updated = { ...orig, x: orig.x + dx, y: orig.y + dy };
        } else if (orig.type === 'line' || orig.type === 'arrow' || orig.type === 'pen') {
          updated = { ...orig, points: orig.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) };
        } else if (orig.type === 'text' || orig.type === 'callout') {
          updated = { ...orig, x: orig.x + dx, y: orig.y + dy };
        } else {
          return;
        }
        setDragPreview(updated);
      } else if (dragState.mode === 'resize') {
        const o = orig as ShapeAnnotation;
        const b = norm(o.x, o.y, o.w, o.h);
        let nx = b.x;
        let ny = b.y;
        let nw = b.w;
        let nh = b.h;
        if (dragState.handle === 'tl') {
          nw = b.x + b.w - pt.x;
          nh = b.y + b.h - pt.y;
          nx = pt.x;
          ny = pt.y;
        } else if (dragState.handle === 'tr') {
          nw = pt.x - b.x;
          nh = b.y + b.h - pt.y;
          ny = pt.y;
        } else if (dragState.handle === 'bl') {
          nw = b.x + b.w - pt.x;
          nh = pt.y - b.y;
          nx = pt.x;
        } else if (dragState.handle === 'br') {
          nw = pt.x - b.x;
          nh = pt.y - b.y;
        }
        setDragPreview({ ...o, x: nx, y: ny, w: nw, h: nh });
      } else if (dragState.mode === 'endpoint') {
        const o = orig as PathAnnotation;
        const points = [...o.points] as Point[];
        const idx = dragState.handle === 'p0' ? 0 : 1;
        points[idx] = pt;
        setDragPreview({ ...o, points });
      }
      return;
    }

    if (draft) {
      if (
        draft.type === 'rect' ||
        draft.type === 'ellipse' ||
        draft.type === 'highlight' ||
        draft.type === 'redact' ||
        draft.type === 'mask'
      ) {
        setDraft({ ...draft, w: pt.x - draft.x, h: pt.y - draft.y });
      } else if (draft.type === 'line' || draft.type === 'arrow') {
        setDraft({ ...draft, points: [draft.points[0], pt] });
      } else if (draft.type === 'pen') {
        setDraft({ ...draft, points: [...draft.points, pt] });
      }
    }
  };

  const onPointerUp = () => {
    if (panDrag) {
      setPanDrag(null);
      return;
    }
    if (dragState && dragPreview) {
      commit(annotations.map((a) => (a.id === dragPreview.id ? dragPreview : a)));
      setDragState(null);
      setDragPreview(null);
      return;
    }
    if (dragState) {
      setDragState(null);
      setDragPreview(null);
      return;
    }
    if (draft) {
      const isDegenerate =
        (draft.type === 'rect' ||
          draft.type === 'ellipse' ||
          draft.type === 'highlight' ||
          draft.type === 'redact' ||
          draft.type === 'mask') &&
        Math.abs(draft.w) < 2 &&
        Math.abs(draft.h) < 2;
      const isDegeneratePath =
        (draft.type === 'line' || draft.type === 'arrow') &&
        Math.hypot(draft.points[1].x - draft.points[0].x, draft.points[1].y - draft.points[0].y) < 2;
      const isDegeneratePen = draft.type === 'pen' && draft.points.length < 2;
      if (!isDegenerate && !isDegeneratePath && !isDegeneratePen) {
        commit([...annotations, draft]);
        setSelectedId(draft.id);
      }
      setDraft(null);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.code === 'Space') {
        setSpaceHeld(true);
        e.preventDefault();
        return;
      }
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }
      if (mod && e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        deleteSelected();
        return;
      }
      if (e.key === 'Escape') {
        setSelectedId(null);
        setTextEdit(null);
        setDraft(null);
        setShowShortcuts(false);
        return;
      }
      const t = TOOL_SHORTCUTS[e.key.toLowerCase()];
      if (t) setTool(t);
      if (e.key === '?') setShowShortcuts((s) => !s);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [deleteSelected, duplicateSelected, redo, selectedId, setSelectedId, setShowShortcuts, setTool, undo]);

  const cursorClass =
    tool === 'pan' || spaceHeld
      ? panDrag
        ? 'cursor-grabbing'
        : 'cursor-grab'
      : tool === 'select'
      ? 'cursor-default'
      : tool === 'text'
      ? 'cursor-text'
      : 'cursor-crosshair';

  const editFontSize = textEdit?.id
    ? (annotations.find((a) => a.id === textEdit.id) as TextAnnotation | undefined)?.fontSize
    : fontSize;
  const editColor = textEdit?.id
    ? (annotations.find((a) => a.id === textEdit.id) as TextAnnotation | undefined)?.color
    : color;

  const activePageSize = pageSizes[pageNumber];

  if (!pdfFile) {
    return (
      <div
        className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`absolute inset-4 flex flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border bg-background/60 text-muted-foreground hover:border-muted-foreground hover:bg-background'
          }`}
        >
          <div className="bg-muted p-4">
            {isDragOver ? <Upload className="size-7" /> : <ImageOff className="size-7" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isLoading ? 'Loading document…' : 'Drop a PDF or image, click to browse, or paste'}
            </p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              PDF · PNG · JPG · WEBP — annotate all pages in the browser
            </p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40"
      style={{
        backgroundImage:
          'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) loadDocumentFile(file);
      }}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto flex w-full justify-center">
          <Document
            key={`annotator-${fileSignature}`}
            file={pdfFile}
            onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
            onLoadError={() => setLoading(false)}
            loading={null}
            className="space-y-4"
          >
            {allPages.map((page) => {
              const pageMarks = page === pageNumber ? renderList : annotationsForPage(page);
              return (
                <div
                  key={`pdf-page-${page}-${zoom}`}
                  ref={(el) => {
                    if (el) pageElementMapRef.current.set(page, el);
                    else pageElementMapRef.current.delete(page);
                  }}
                  className={`relative border bg-background shadow-sm transition-shadow ${
                    page === pageNumber ? 'border-primary ring-1 ring-primary/40' : 'border-border'
                  }`}
                  onClick={() => void setPage(page)}
                >
                  <Page
                    pageNumber={page}
                    scale={zoom}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onLoadSuccess={(pdfPage) => {
                      const viewport = pdfPage.getViewport({ scale: 1 });
                      setPageSizes((current) => ({
                        ...current,
                        [page]: { width: viewport.width, height: viewport.height },
                      }));
                    }}
                    className="block"
                  />
                  <canvas
                    ref={(el) => {
                      if (el) overlayCanvasMapRef.current.set(page, el);
                      else overlayCanvasMapRef.current.delete(page);
                    }}
                    className={`absolute inset-0 z-20 touch-none ${
                      page === pageNumber ? cursorClass : 'cursor-pointer'
                    }`}
                    onPointerDown={page === pageNumber ? onPointerDown : undefined}
                    onPointerMove={page === pageNumber ? onPointerMove : undefined}
                    onPointerUp={page === pageNumber ? onPointerUp : undefined}
                    onPointerLeave={page === pageNumber ? onPointerUp : undefined}
                    onDoubleClick={(e) => {
                      if (page !== pageNumber || (tool !== 'select' && tool !== 'text')) return;
                      const pt = screenToPage(e.clientX, e.clientY);
                      const hit = findAnnotationAt(pt);
                      if (hit && hit.type === 'text') startTextEdit(pt, hit);
                    }}
                  />
                  {page === pageNumber && textEdit && activePageSize && (
                    <textarea
                      ref={textAreaRef}
                      value={textEdit.value}
                      onChange={(e) => setTextEdit({ ...textEdit, value: e.target.value })}
                      onBlur={() => commitTextEdit()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          (e.target as HTMLTextAreaElement).blur();
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault();
                          setTextEdit(null);
                        }
                      }}
                      placeholder="Type here…"
                      style={{
                        position: 'absolute',
                        left: textEdit.x * zoom,
                        top: textEdit.y * zoom,
                        fontSize: (editFontSize ?? fontSize) * zoom,
                        color: editColor ?? color,
                        lineHeight: 1.3,
                        minWidth: Math.max(80, 6 * (editFontSize ?? fontSize) * zoom),
                        fontWeight: 600,
                        zIndex: 30,
                      }}
                      className="resize-none overflow-hidden border border-dashed border-primary bg-background/90 px-1.5 py-0.5 shadow-sm outline-none"
                      rows={1}
                    />
                  )}
                  {pageMarks.length > 0 && (
                    <span className="pointer-events-none absolute top-2 right-2 z-20 border border-border bg-background/90 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      p{page} · {pageMarks.length}
                    </span>
                  )}
                </div>
              );
            })}
          </Document>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 font-mono text-xs text-muted-foreground backdrop-blur-[1px]">
          Loading PDF…
        </div>
      )}

      {showShortcuts && (
        <div className="absolute top-3 right-3 z-50 w-64 border border-border bg-card p-3 text-xs shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-heading text-sm font-semibold">Shortcuts</span>
            <button
              type="button"
              onClick={() => setShowShortcuts(false)}
              aria-label="Close"
              className="text-muted-foreground"
            >
              Esc
            </button>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">Press ? anytime · see sidebar for the full list</p>
        </div>
      )}
    </div>
  );
}
