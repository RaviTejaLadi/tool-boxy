import { useCallback, useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { cn } from '@/lib/utils';
import { MIN_CROP_SIZE } from '../constants';
import { useCropStore, type CropArea } from '../stores';

function initialCropArea(imgW: number, imgH: number, aspectRatio: number | null): CropArea {
  const cropSize = Math.min(imgW, imgH) * 0.7;
  const crop: CropArea = {
    x: (imgW - cropSize) / 2,
    y: (imgH - cropSize) / 2,
    width: cropSize,
    height: aspectRatio ? cropSize / aspectRatio : cropSize,
  };

  if (aspectRatio) {
    if (crop.width / crop.height > aspectRatio) {
      crop.width = crop.height * aspectRatio;
    } else {
      crop.height = crop.width / aspectRatio;
    }
    crop.x = (imgW - crop.width) / 2;
    crop.y = (imgH - crop.height) / 2;
  }

  return crop;
}

export function CropEditor() {
  const source = useCropStore((s) => s.source);
  const cropArea = useCropStore((s) => s.cropArea);
  const zoom = useCropStore((s) => s.zoom);
  const aspectRatioId = useCropStore((s) => s.aspectRatioId);
  const setCropArea = useCropStore((s) => s.setCropArea);
  const setDisplaySize = useCropStore((s) => s.setDisplaySize);
  const getAspectRatio = useCropStore((s) => s.getAspectRatio);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const resizeDirectionRef = useRef('');
  const dragStartRef = useRef({ x: 0, y: 0 });
  const cropAreaRef = useRef(cropArea);
  const displaySizeRef = useRef({ width: 0, height: 0 });
  const [, setOverlayTick] = useState(0);
  const [hoverCursor, setHoverCursor] = useState('default');

  cropAreaRef.current = cropArea;

  const aspectRatio = getAspectRatio();

  const syncDisplaySize = useCallback(() => {
    const img = imageRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    const width = rect.width / zoom;
    const height = rect.height / zoom;
    displaySizeRef.current = { width, height };
    setDisplaySize({ width, height });
    setOverlayTick((t) => t + 1);
    return { width, height };
  }, [setDisplaySize, zoom]);

  useEffect(() => {
    if (!source) return;

    const img = imageRef.current;
    if (!img) return;

    const onReady = () => {
      const size = syncDisplaySize();
      if (!size || size.width === 0) return;
      setCropArea(initialCropArea(size.width, size.height, aspectRatio));
    };

    if (img.complete && img.naturalWidth > 0) onReady();
    else {
      img.addEventListener('load', onReady);
      return () => img.removeEventListener('load', onReady);
    }
    // Only re-init crop when source or aspect ratio changes — not on zoom
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, aspectRatioId, aspectRatio, setCropArea]);

  useEffect(() => {
    // Keep overlay in sync after zoom without resetting the crop box
    const id = requestAnimationFrame(() => syncDisplaySize());
    return () => cancelAnimationFrame(id);
  }, [zoom, syncDisplaySize]);

  const getRelativePosition = useCallback((e: MouseEvent | TouchEvent) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const rect = imageRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const { width, height } = displaySizeRef.current;
    return {
      x: ((clientX - rect.left) / rect.width) * width,
      y: ((clientY - rect.top) / rect.height) * height,
    };
  }, []);

  const getResizeDirection = useCallback((x: number, y: number) => {
    const crop = cropAreaRef.current;
    if (!crop) return '';
    const { x: cx, y: cy, width, height } = crop;
    const handleSize = 16;

    const isLeft = x >= cx - handleSize && x <= cx + handleSize;
    const isRight = x >= cx + width - handleSize && x <= cx + width + handleSize;
    const isTop = y >= cy - handleSize && y <= cy + handleSize;
    const isBottom = y >= cy + height - handleSize && y <= cy + height + handleSize;

    if (isLeft && isTop) return 'nw';
    if (isRight && isTop) return 'ne';
    if (isLeft && isBottom) return 'sw';
    if (isRight && isBottom) return 'se';
    if (isLeft) return 'w';
    if (isRight) return 'e';
    if (isTop) return 'n';
    if (isBottom) return 's';
    return '';
  }, []);

  const isInsideCrop = useCallback((x: number, y: number) => {
    const crop = cropAreaRef.current;
    if (!crop) return false;
    return x >= crop.x && x <= crop.x + crop.width && y >= crop.y && y <= crop.y + crop.height;
  }, []);

  const cursorForDirection = (dir: string) => {
    switch (dir) {
      case 'nw':
      case 'se':
        return 'nwse-resize';
      case 'ne':
      case 'sw':
        return 'nesw-resize';
      case 'n':
      case 's':
        return 'ns-resize';
      case 'w':
      case 'e':
        return 'ew-resize';
      default:
        return 'default';
    }
  };

  const startResize = (dir: string, e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const pos = getRelativePosition(e);
    isResizingRef.current = true;
    isDraggingRef.current = false;
    resizeDirectionRef.current = dir;
    dragStartRef.current = { x: pos.x, y: pos.y };
    setHoverCursor(cursorForDirection(dir));
  };

  const updateHoverCursor = (e: MouseEvent) => {
    if (isDraggingRef.current) {
      setHoverCursor('grabbing');
      return;
    }
    if (isResizingRef.current) {
      setHoverCursor(cursorForDirection(resizeDirectionRef.current));
      return;
    }
    if (!cropAreaRef.current) {
      setHoverCursor('default');
      return;
    }
    const pos = getRelativePosition(e);
    const dir = getResizeDirection(pos.x, pos.y);
    if (dir) setHoverCursor(cursorForDirection(dir));
    else if (isInsideCrop(pos.x, pos.y)) setHoverCursor('move');
    else setHoverCursor('default');
  };

  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!cropAreaRef.current) return;
    const pos = getRelativePosition(e);
    const dir = getResizeDirection(pos.x, pos.y);

    if (dir) {
      isResizingRef.current = true;
      isDraggingRef.current = false;
      resizeDirectionRef.current = dir;
      dragStartRef.current = { x: pos.x, y: pos.y };
      setHoverCursor(cursorForDirection(dir));
    } else if (isInsideCrop(pos.x, pos.y)) {
      isDraggingRef.current = true;
      isResizingRef.current = false;
      dragStartRef.current = { x: pos.x - cropAreaRef.current.x, y: pos.y - cropAreaRef.current.y };
      setHoverCursor('grabbing');
    }
  };

  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current && !isResizingRef.current) {
      if (!('touches' in e)) updateHoverCursor(e);
      return;
    }
    e.preventDefault();

    const crop = cropAreaRef.current;
    if (!crop) return;

    const pos = getRelativePosition(e);
    const { width: imgW, height: imgH } = displaySizeRef.current;
    const ratio = getAspectRatio();

    if (isDraggingRef.current) {
      let newX = pos.x - dragStartRef.current.x;
      let newY = pos.y - dragStartRef.current.y;
      newX = Math.max(0, Math.min(newX, imgW - crop.width));
      newY = Math.max(0, Math.min(newY, imgH - crop.height));
      const next = { ...crop, x: newX, y: newY };
      cropAreaRef.current = next;
      setCropArea(next);
      return;
    }

    const dx = pos.x - dragStartRef.current.x;
    const dy = pos.y - dragStartRef.current.y;
    const directions = resizeDirectionRef.current;
    let newX = crop.x;
    let newY = crop.y;
    let newWidth = crop.width;
    let newHeight = crop.height;

    if (directions.includes('e')) {
      newWidth = Math.max(MIN_CROP_SIZE, crop.width + dx);
      if (ratio) {
        newHeight = newWidth / ratio;
        if (directions.includes('n')) newY = crop.y + crop.height - newHeight;
      }
    }
    if (directions.includes('w')) {
      const potentialWidth = Math.max(MIN_CROP_SIZE, crop.width - dx);
      newX = crop.x + crop.width - potentialWidth;
      newWidth = potentialWidth;
      if (ratio) {
        newHeight = newWidth / ratio;
        if (directions.includes('s')) newY = crop.y + crop.height - newHeight;
      }
    }
    if (directions.includes('s')) {
      if (!ratio) {
        newHeight = Math.max(MIN_CROP_SIZE, crop.height + dy);
      } else if (!directions.includes('e') && !directions.includes('w')) {
        newHeight = Math.max(MIN_CROP_SIZE, crop.height + dy);
        newWidth = newHeight * ratio;
      }
    }
    if (directions.includes('n')) {
      if (!ratio) {
        const potentialHeight = Math.max(MIN_CROP_SIZE, crop.height - dy);
        newY = crop.y + crop.height - potentialHeight;
        newHeight = potentialHeight;
      } else if (!directions.includes('e') && !directions.includes('w')) {
        const potentialHeight = Math.max(MIN_CROP_SIZE, crop.height - dy);
        newY = crop.y + crop.height - potentialHeight;
        newHeight = potentialHeight;
        newWidth = newHeight * ratio;
      }
    }

    newX = Math.max(0, Math.min(newX, imgW - MIN_CROP_SIZE));
    newY = Math.max(0, Math.min(newY, imgH - MIN_CROP_SIZE));
    newWidth = Math.min(Math.max(MIN_CROP_SIZE, newWidth), imgW - newX);
    newHeight = Math.min(Math.max(MIN_CROP_SIZE, newHeight), imgH - newY);

    if (ratio) {
      if (newWidth / newHeight > ratio) newWidth = newHeight * ratio;
      else newHeight = newWidth / ratio;
      newWidth = Math.min(newWidth, imgW - newX);
      newHeight = Math.min(newHeight, imgH - newY);
    }

    const next = { x: newX, y: newY, width: newWidth, height: newHeight };
    cropAreaRef.current = next;
    dragStartRef.current = { x: pos.x, y: pos.y };
    setCropArea(next);
  };

  const handlePointerUp = (e?: MouseEvent | TouchEvent) => {
    isDraggingRef.current = false;
    isResizingRef.current = false;
    resizeDirectionRef.current = '';
    if (e && !('touches' in e)) updateHoverCursor(e);
    else setHoverCursor('default');
  };

  if (!source) return null;

  let overlay: {
    left: number;
    top: number;
    w: number;
    h: number;
    imgLeft: number;
    imgTop: number;
    imgW: number;
    imgH: number;
  } | null = null;

  if (cropArea && imageRef.current && containerRef.current && displaySizeRef.current.width > 0) {
    const rect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = rect.left - containerRect.left;
    const offsetY = rect.top - containerRect.top;
    const sx = rect.width / displaySizeRef.current.width;
    const sy = rect.height / displaySizeRef.current.height;

    overlay = {
      left: offsetX + cropArea.x * sx,
      top: offsetY + cropArea.y * sy,
      w: cropArea.width * sx,
      h: cropArea.height * sy,
      imgLeft: offsetX,
      imgTop: offsetY,
      imgW: rect.width,
      imgH: rect.height,
    };
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-h-[min(520px,58svh)] max-w-full overflow-hidden border border-border bg-background select-none"
      style={{ cursor: hoverCursor }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={() => handlePointerUp()}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={() => handlePointerUp()}
    >
      <img
        ref={imageRef}
        src={source.dataUrl}
        alt={source.name}
        className="pointer-events-none block max-h-[min(520px,58svh)] max-w-full"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
        draggable={false}
      />

      {overlay && (
        <>
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute bg-black/50"
              style={{
                left: overlay.imgLeft,
                top: overlay.imgTop,
                width: overlay.imgW,
                height: Math.max(0, overlay.top - overlay.imgTop),
              }}
            />
            <div
              className="absolute bg-black/50"
              style={{
                left: overlay.imgLeft,
                top: overlay.top,
                width: Math.max(0, overlay.left - overlay.imgLeft),
                height: overlay.h,
              }}
            />
            <div
              className="absolute bg-black/50"
              style={{
                left: overlay.left + overlay.w,
                top: overlay.top,
                width: Math.max(0, overlay.imgLeft + overlay.imgW - overlay.left - overlay.w),
                height: overlay.h,
              }}
            />
            <div
              className="absolute bg-black/50"
              style={{
                left: overlay.imgLeft,
                top: overlay.top + overlay.h,
                width: overlay.imgW,
                height: Math.max(0, overlay.imgTop + overlay.imgH - overlay.top - overlay.h),
              }}
            />
          </div>

          <div
            className="pointer-events-none absolute border-2 border-white"
            style={{ left: overlay.left, top: overlay.top, width: overlay.w, height: overlay.h, cursor: 'move' }}
          >
            <div className="pointer-events-none absolute inset-0">
              {[1, 2].map((i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-white/30"
                  style={{ left: `${(i / 3) * 100}%` }}
                />
              ))}
              {[1, 2].map((i) => (
                <div key={`h-${i}`} className="absolute h-px w-full bg-white/30" style={{ top: `${(i / 3) * 100}%` }} />
              ))}
            </div>

            {(['nw', 'ne', 'sw', 'se'] as const).map((dir) => (
              <div
                key={dir}
                className={cn('absolute size-3.5 border-2 border-primary bg-white pointer-events-auto', {
                  'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize': dir === 'nw',
                  'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize': dir === 'ne',
                  'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize': dir === 'sw',
                  'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize': dir === 'se',
                })}
                onMouseDown={(e) => startResize(dir, e)}
                onTouchStart={(e) => startResize(dir, e)}
              />
            ))}

            {(['n', 's', 'w', 'e'] as const).map((dir) => (
              <div
                key={dir}
                className={cn('absolute bg-white pointer-events-auto', {
                  'top-0 left-1/2 h-1.5 w-6 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize': dir === 'n',
                  'bottom-0 left-1/2 h-1.5 w-6 -translate-x-1/2 translate-y-1/2 cursor-ns-resize': dir === 's',
                  'top-1/2 left-0 h-6 w-1.5 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize': dir === 'w',
                  'top-1/2 right-0 h-6 w-1.5 translate-x-1/2 -translate-y-1/2 cursor-ew-resize': dir === 'e',
                })}
                onMouseDown={(e) => startResize(dir, e)}
                onTouchStart={(e) => startResize(dir, e)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
