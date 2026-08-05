// @ts-nocheck — typed gradually
import { useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useActiveBackground, useActiveElements, useComposerStore, usePanelStore } from '../stores';
import { elementLabel, elementTypeLabel } from '../helpers/elementLabel';
import { getShapeBorderRadius, shapeClipPath } from '../helpers/shapePaths';
import { FormatSelect } from './FormatSelect';
import { HoverOutline, SelectionOverlay } from './SelectionOverlay';
import { SlideStrip } from './SlideStrip';

const MAX_W = 560;
const MAX_H = 520;
const MIN_SIZE = 20;

function applyResize(origX, origY, origW, origH, dx, dy, corner) {
  let x = origX;
  let y = origY;
  let width = origW;
  let height = origH;

  if (corner.includes('e')) width = Math.max(MIN_SIZE, origW + dx);
  if (corner.includes('w')) {
    width = Math.max(MIN_SIZE, origW - dx);
    x = origX + origW - width;
  }
  if (corner.includes('s')) height = Math.max(MIN_SIZE, origH + dy);
  if (corner.includes('n')) {
    height = Math.max(MIN_SIZE, origH - dy);
    y = origY + origH - height;
  }

  return { x, y, width, height };
}

export function PreviewPane() {
  const format = useComposerStore((s) => s.format);
  const background = useActiveBackground();
  const elements = useActiveElements();
  const selectedId = useComposerStore((s) => s.selectedId);
  const editingTextId = useComposerStore((s) => s.editingTextId);
  const setSelectedId = useComposerStore((s) => s.setSelectedId);
  const setEditingTextId = useComposerStore((s) => s.setEditingTextId);
  const commitTextEdit = useComposerStore((s) => s.commitTextEdit);
  const setActivePanel = usePanelStore((s) => s.setActivePanel);

  const [hoveredId, setHoveredId] = useState(null);
  const dragRef = useRef(null);
  const scale = Math.min(MAX_W / format.w, MAX_H / format.h);
  const stageW = format.w * scale;
  const stageH = format.h * scale;

  const getBeforeSnapshot = () =>
    useComposerStore.getState().slides.find((s) => s.id === useComposerStore.getState().activeSlideId)?.elements;

  const onDragMove = (e) => {
    const ds = dragRef.current;
    if (!ds) return;
    const dx = (e.clientX - ds.startX) / scale;
    const dy = (e.clientY - ds.startY) / scale;
    useComposerStore.setState((state) => {
      const slide = state.slides.find((s) => s.id === state.activeSlideId);
      if (!slide) return state;
      const nextElements = slide.elements.map((el) => {
        if (el.id !== ds.id) return el;
        if (ds.mode === 'move') return { ...el, x: ds.origX + dx, y: ds.origY + dy };
        const resized = applyResize(ds.origX, ds.origY, ds.origW, ds.origH, dx, dy, ds.corner || 'se');
        return { ...el, ...resized };
      });
      return {
        slides: state.slides.map((s) => (s.id === state.activeSlideId ? { ...s, elements: nextElements } : s)),
      };
    });
  };

  const onDragEnd = () => {
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
    if (dragRef.current?.before) {
      const { before } = dragRef.current;
      const { activeSlideId, historyBySlide } = useComposerStore.getState();
      useComposerStore.setState({
        historyBySlide: {
          ...historyBySlide,
          [activeSlideId]: {
            past: [...(historyBySlide[activeSlideId]?.past || []), before],
            future: [],
          },
        },
      });
    }
    dragRef.current = null;
  };

  const startDrag = (e, el, mode, extra = {}) => {
    if (editingTextId === el.id) return;
    e.stopPropagation();
    setSelectedId(el.id);
    setActivePanel('edit');
    dragRef.current = {
      id: el.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height,
      before: getBeforeSnapshot(),
      ...extra,
    };
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  };

  const onElementMouseDown = (e, el) => startDrag(e, el, 'move');

  const onResizeMouseDown = (e, el, corner = 'se') => {
    e.stopPropagation();
    startDrag(e, el, 'resize', { corner });
  };

  const renderElement = (el, index) => {
    const isSelected = selectedId === el.id;
    const isHovered = hoveredId === el.id && !isSelected;
    const isEditing = editingTextId === el.id;

    const wrapperStyle = {
      position: 'absolute',
      left: el.x * scale,
      top: el.y * scale,
      width: el.width * scale,
      height: el.height * scale,
      transform: `rotate(${el.rotation || 0}deg)`,
      cursor: isEditing ? 'text' : 'move',
      zIndex: isSelected ? elements.length + 10 : index + 1,
    };

    const contentOpacity = el.opacity ?? 1;

    let inner = null;
    if (el.type === 'shape') {
      const clip = shapeClipPath(el.shapeType);
      const borderRadius = getShapeBorderRadius(el.shapeType, el.radius || 0, scale);
      inner = (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: el.fill,
            clipPath: clip,
            borderRadius,
            border: el.stroke ? `${(el.strokeWidth || 2) * scale}px solid ${el.stroke}` : undefined,
            boxSizing: 'border-box',
          }}
        />
      );
    } else if (el.type === 'image') {
      inner = (
        <img
          src={el.src}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="pointer-events-none h-full w-full select-none object-cover"
          alt=""
        />
      );
    } else if (el.type === 'text') {
      const textStyle = {
        width: '100%',
        height: '100%',
        fontSize: el.fontSize * scale,
        fontWeight: el.fontWeight,
        fontFamily: el.fontFamily,
        color: el.color,
        textAlign: el.align,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: el.lineHeight || 1.25,
        letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
        outline: 'none',
      };
      if (isEditing) {
        inner = (
          <div
            contentEditable
            suppressContentEditableWarning
            autoFocus
            style={textStyle}
            onMouseDown={(e) => e.stopPropagation()}
            onBlur={(e) => commitTextEdit(el.id, e.currentTarget.innerText)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') e.currentTarget.blur();
            }}
          >
            {el.text}
          </div>
        );
      } else {
        inner = (
          <div style={textStyle} onDoubleClick={() => setEditingTextId(el.id)}>
            {el.text}
          </div>
        );
      }
    }

    return (
      <div
        key={el.id}
        style={wrapperStyle}
        className={cn('group/element touch-none', isSelected && 'z-50')}
        onMouseDown={(e) => onElementMouseDown(e, el)}
        onMouseEnter={() => setHoveredId(el.id)}
        onMouseLeave={() => setHoveredId((id) => (id === el.id ? null : id))}
      >
        <div className="h-full w-full" style={{ opacity: contentOpacity }}>
          {inner}
        </div>

        {isHovered && !isEditing && <HoverOutline />}

        {isSelected && !isEditing && (
          <SelectionOverlay
            label={elementLabel(el)}
            typeLabel={elementTypeLabel(el)}
            onResizeStart={(e, corner) => onResizeMouseDown(e, el, corner)}
          />
        )}

        {isEditing && (
          <div
            className="pointer-events-none absolute inset-0 border-2 border-primary border-dashed"
            style={{
              boxShadow: '0 0 0 1px color-mix(in oklab, var(--background) 80%, transparent)',
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div className="pointer-events-none absolute top-3 right-3 z-10">
        <FormatSelect />
      </div>
      <ScrollArea
        className="h-0 min-h-0 flex-1"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div
          className="flex min-h-full items-center justify-center p-6 pt-12 lg:p-10 lg:pt-14"
          onMouseDown={() => {
            setSelectedId(null);
            setHoveredId(null);
          }}
        >
          <div
            className="relative shadow-2xl ring-1 ring-border/50"
            style={{
              width: stageW,
              height: stageH,
              backgroundColor: background.type === 'color' ? background.value : undefined,
              backgroundImage: background.type === 'gradient' ? background.value : undefined,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {elements.map((el, index) => renderElement(el, index))}

            {selectedId && !elements.some((el) => el.id === selectedId) && <p className="sr-only">Selection cleared</p>}
          </div>
        </div>
      </ScrollArea>
      <SlideStrip />
    </div>
  );
}
