import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent,
  type RefObject,
  type WheelEvent,
} from 'react';
import { ImageOff, Upload } from 'lucide-react';
import { HANDLE_PX, HIT_PAD_PX, MAX_ZOOM, MIN_ZOOM, TOOL_SHORTCUTS } from '../constants';
import { boundsOf, clamp, drawAnnotation, hitTest, norm, readDocumentFile, uid } from '../helpers';
import { useAnnotatorStore, selectAnnotations } from '../stores';
import { PdfPreviewPane } from './PdfPreviewPane';
import type {
  Annotation,
  CalloutAnnotation,
  DragState,
  PathAnnotation,
  Point,
  ShapeAnnotation,
  TextAnnotation,
} from '../types';

function isTypingTarget(el: EventTarget | null) {
  const tag = (el as HTMLElement | null)?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA';
}

export function PreviewPane({ fileInputRef }: { fileInputRef: RefObject<HTMLInputElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const image = useAnnotatorStore((s) => s.image);
  const sourceKind = useAnnotatorStore((s) => s.sourceKind);
  const pdfFile = useAnnotatorStore((s) => s.pdfFile);
  const annotations = useAnnotatorStore(selectAnnotations);
  const tool = useAnnotatorStore((s) => s.tool);
  const color = useAnnotatorStore((s) => s.color);
  const strokeWidth = useAnnotatorStore((s) => s.strokeWidth);
  const fontSize = useAnnotatorStore((s) => s.fontSize);
  const opacity = useAnnotatorStore((s) => s.opacity);
  const filled = useAnnotatorStore((s) => s.filled);
  const dashed = useAnnotatorStore((s) => s.dashed);
  const selectedId = useAnnotatorStore((s) => s.selectedId);
  const zoom = useAnnotatorStore((s) => s.zoom);
  const pan = useAnnotatorStore((s) => s.pan);
  const showShortcuts = useAnnotatorStore((s) => s.showShortcuts);

  const loadDocument = useAnnotatorStore((s) => s.loadDocument);
  const setLoading = useAnnotatorStore((s) => s.setLoading);
  const isLoading = useAnnotatorStore((s) => s.isLoading);
  const commit = useAnnotatorStore((s) => s.commit);
  const undo = useAnnotatorStore((s) => s.undo);
  const redo = useAnnotatorStore((s) => s.redo);
  const setTool = useAnnotatorStore((s) => s.setTool);
  const setSelectedId = useAnnotatorStore((s) => s.setSelectedId);
  const setZoom = useAnnotatorStore((s) => s.setZoom);
  const setPan = useAnnotatorStore((s) => s.setPan);
  const setShowShortcuts = useAnnotatorStore((s) => s.setShowShortcuts);
  const deleteSelected = useAnnotatorStore((s) => s.deleteSelected);
  const duplicateSelected = useAnnotatorStore((s) => s.duplicateSelected);
  const takeCalloutNumber = useAnnotatorStore((s) => s.takeCalloutNumber);

  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [draft, setDraft] = useState<Annotation | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragPreview, setDragPreview] = useState<Annotation | null>(null);
  const [panDrag, setPanDrag] = useState<{ startClient: Point; startPan: Point } | null>(null);
  const [textEdit, setTextEdit] = useState<{ id: string | null; x: number; y: number; value: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);

  const styleBase = useMemo(() => ({ color, strokeWidth, opacity, dashed }), [color, strokeWidth, opacity, dashed]);

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

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/') || item.type === 'application/pdf') {
          const file = item.getAsFile();
          if (file) loadDocumentFile(file);
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [loadDocumentFile]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!textEdit) return;
    const id = window.requestAnimationFrame(() => {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    });
    return () => window.cancelAnimationFrame(id);
  }, [textEdit]);

  const baseScale = useMemo(() => {
    if (!image || containerSize.w === 0 || containerSize.h === 0) return 1;
    const pad = 32;
    return Math.min((containerSize.w - pad) / image.naturalWidth, (containerSize.h - pad) / image.naturalHeight);
  }, [image, containerSize]);

  const scale = baseScale * zoom;

  const centerOffset = useMemo(() => {
    if (!image) return { x: 0, y: 0 };
    return {
      x: (containerSize.w - image.naturalWidth * scale) / 2,
      y: (containerSize.h - image.naturalHeight * scale) / 2,
    };
  }, [image, containerSize, scale]);

  const offset = { x: centerOffset.x + pan.x, y: centerOffset.y + pan.y };

  const screenToImage = useCallback(
    (clientX: number, clientY: number): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      return { x: (sx - offset.x) / scale, y: (sy - offset.y) / scale };
    },
    [offset.x, offset.y, scale]
  );

  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !image) {
        setZoom((z) => clamp(z * factor, MIN_ZOOM, MAX_ZOOM));
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const imgPt = screenToImage(clientX, clientY);
      setZoom((z) => {
        const newZoom = clamp(z * factor, MIN_ZOOM, MAX_ZOOM);
        const newScale = baseScale * newZoom;
        const newCenterOffset = {
          x: (containerSize.w - image.naturalWidth * newScale) / 2,
          y: (containerSize.h - image.naturalHeight * newScale) / 2,
        };
        setPan({
          x: sx - newCenterOffset.x - imgPt.x * newScale,
          y: sy - newCenterOffset.y - imgPt.y * newScale,
        });
        return newZoom;
      });
    },
    [baseScale, containerSize, image, screenToImage, setPan, setZoom]
  );

  const renderList = useMemo(() => {
    const list = annotations
      .filter((a) => !(textEdit && a.id === textEdit.id))
      .map((a) => (dragPreview && a.id === dragPreview.id ? dragPreview : a));
    if (draft) list.push(draft);
    return list;
  }, [annotations, dragPreview, draft, textEdit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerSize.w * dpr;
    canvas.height = containerSize.h * dpr;
    canvas.style.width = `${containerSize.w}px`;
    canvas.style.height = `${containerSize.h}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, containerSize.w, containerSize.h);

    if (!image) return;

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

    for (const a of renderList) {
      drawAnnotation(ctx, a, image);
    }

    const selected = renderList.find((a) => a.id === selectedId);
    if (selected) {
      const b = boundsOf(selected);
      const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3b82f6';
      ctx.save();
      ctx.strokeStyle = primary;
      ctx.lineWidth = 1.5 / scale;
      ctx.setLineDash([5 / scale, 4 / scale]);
      ctx.strokeRect(b.x - 4 / scale, b.y - 4 / scale, b.w + 8 / scale, b.h + 8 / scale);
      ctx.setLineDash([]);

      const handleSize = HANDLE_PX / scale;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = primary;
      ctx.lineWidth = 1.5 / scale;

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

    ctx.restore();
  }, [image, containerSize, offset.x, offset.y, scale, renderList, selectedId]);

  const hitPadImg = HIT_PAD_PX / scale;
  const handleSizeImg = HANDLE_PX / scale;

  const findAnnotationAt = useCallback(
    (pt: Point): Annotation | null => {
      for (let i = annotations.length - 1; i >= 0; i--) {
        if (hitTest(pt, annotations[i], hitPadImg)) return annotations[i];
      }
      return null;
    },
    [annotations, hitPadImg]
  );

  const findHandleAt = useCallback(
    (pt: Point, a: Annotation): string | null => {
      const b = boundsOf(a);
      const near = (hx: number, hy: number) =>
        Math.abs(pt.x - hx) <= handleSizeImg && Math.abs(pt.y - hy) <= handleSizeImg;
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
    [handleSizeImg]
  );

  const commitTextEdit = useCallback(() => {
    setTextEdit((te) => {
      if (!te) return null;
      const trimmed = te.value;
      if (te.id) {
        if (trimmed.trim().length === 0) {
          commit(annotations.filter((a) => a.id !== te.id));
          if (selectedId === te.id) setSelectedId(null);
        } else {
          commit(annotations.map((a) => (a.id === te.id && a.type === 'text' ? { ...a, text: trimmed } : a)));
        }
      } else if (trimmed.trim().length > 0) {
        const textAnno: TextAnnotation = {
          id: uid(),
          type: 'text',
          x: te.x,
          y: te.y,
          text: trimmed,
          fontSize,
          color: styleBase.color,
          strokeWidth: styleBase.strokeWidth,
          opacity: styleBase.opacity,
          dashed: false,
        };
        commit([...annotations, textAnno]);
        setSelectedId(textAnno.id);
      }
      return null;
    });
  }, [annotations, commit, fontSize, selectedId, setSelectedId, styleBase]);

  const startTextEdit = (pt: Point, existing?: TextAnnotation) => {
    if (existing) {
      setTextEdit({ id: existing.id, x: existing.x, y: existing.y, value: existing.text });
      setSelectedId(existing.id);
      return;
    }
    setTextEdit({ id: null, x: pt.x, y: pt.y, value: '' });
  };

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!image) return;
    const pt = screenToImage(e.clientX, e.clientY);

    if (tool === 'text') {
      if (textEdit) commitTextEdit();
      startTextEdit(pt);
      return;
    }

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (tool === 'pan' || spaceHeld) {
      setPanDrag({ startClient: { x: e.clientX, y: e.clientY }, startPan: pan });
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
      setPan({
        x: panDrag.startPan.x + (e.clientX - panDrag.startClient.x),
        y: panDrag.startPan.y + (e.clientY - panDrag.startClient.y),
      });
      return;
    }
    if (!image) return;
    const pt = screenToImage(e.clientX, e.clientY);

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

  const onWheel = (e: WheelEvent<HTMLCanvasElement>) => {
    if (!image) return;
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 0.9 : 1.1);
  };

  useEffect(() => {
    if (sourceKind === 'pdf') return;
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
      if (!image) return;
      const t = TOOL_SHORTCUTS[e.key.toLowerCase()];
      if (t) setTool(t);
      if (e.key === '+' || e.key === '=') zoomAt(containerSize.w / 2, containerSize.h / 2, 1.15);
      if (e.key === '-') zoomAt(containerSize.w / 2, containerSize.h / 2, 0.87);
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
  }, [
    containerSize,
    deleteSelected,
    duplicateSelected,
    image,
    redo,
    selectedId,
    setSelectedId,
    setShowShortcuts,
    setTool,
    sourceKind,
    undo,
    zoomAt,
  ]);

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

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadDocumentFile(file);
  };

  const editFontSize = textEdit?.id
    ? (annotations.find((a) => a.id === textEdit.id) as TextAnnotation | undefined)?.fontSize
    : fontSize;
  const editColor = textEdit?.id
    ? (annotations.find((a) => a.id === textEdit.id) as TextAnnotation | undefined)?.color
    : color;

  if (sourceKind === 'pdf' && pdfFile) {
    return <PdfPreviewPane fileInputRef={fileInputRef} />;
  }

  return (
    <div
      ref={containerRef}
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
      onDrop={onDrop}
    >
      {image ? (
        <>
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 touch-none ${cursorClass}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onWheel={onWheel}
            onDoubleClick={(e) => {
              if (tool !== 'select' && tool !== 'text') return;
              const pt = screenToImage(e.clientX, e.clientY);
              const hit = findAnnotationAt(pt);
              if (hit && hit.type === 'text') {
                startTextEdit(pt, hit);
              }
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 font-mono text-xs text-muted-foreground backdrop-blur-[1px]">
              Rendering page…
            </div>
          )}
        </>
      ) : (
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
      )}

      {textEdit && image && (
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
            left: offset.x + textEdit.x * scale,
            top: offset.y + textEdit.y * scale,
            fontSize: (editFontSize ?? fontSize) * scale,
            color: editColor ?? color,
            lineHeight: 1.3,
            minWidth: Math.max(80, 6 * (editFontSize ?? fontSize) * scale),
            fontWeight: 600,
            zIndex: 50,
          }}
          className="resize-none overflow-hidden border border-dashed border-primary bg-background/90 px-1.5 py-0.5 shadow-sm outline-none"
          rows={1}
        />
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
