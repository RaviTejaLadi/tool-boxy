import { memo, useEffect, useRef, useState } from 'react';

type MermaidAPI = typeof import('mermaid').default;

let mermaidSingleton: MermaidAPI | null = null;
let mermaidLoadPromise: Promise<MermaidAPI> | null = null;

function ensureMermaid(): Promise<MermaidAPI> {
  if (mermaidSingleton) return Promise.resolve(mermaidSingleton);
  if (!mermaidLoadPromise) {
    mermaidLoadPromise = import('mermaid').then((mod) => {
      mermaidSingleton = mod.default;
      return mermaidSingleton;
    });
  }
  return mermaidLoadPromise;
}

type MermaidThemeMode = 'light' | 'dark';

const renderedDiagramCache = new Map<string, string>();

const cacheRenderedDiagram = (key: string, svg: string) => {
  renderedDiagramCache.set(key, svg);
  if (renderedDiagramCache.size > 50) {
    const oldestKey = renderedDiagramCache.keys().next().value;
    if (oldestKey) renderedDiagramCache.delete(oldestKey);
  }
};

const initMermaid = (mermaidApi: MermaidAPI, isDark: boolean) => {
  mermaidApi.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'base',
    deterministicIds: true,
    maxTextSize: 90000,
    fontFamily: 'cerebri, "Segoe UI", system-ui, sans-serif',
    themeVariables: isDark
      ? {
          background: '#0f1420',
          mainBkg: '#151d30',
          primaryColor: '#1b2640',
          primaryTextColor: '#e8ecff',
          primaryBorderColor: '#7a8fd4',

          secondaryColor: '#22304d',
          secondaryTextColor: '#d3dbf9',
          secondaryBorderColor: '#6a7fc2',

          tertiaryColor: '#172035',
          tertiaryTextColor: '#d3dbf9',
          tertiaryBorderColor: '#6174b4',

          lineColor: '#8fa3ea',
          edgeLabelBackground: '#1b2640',

          clusterBkg: '#111a2c',
          clusterBorder: '#5f72b4',

          nodeTextColor: '#e8ecff',
          //   labelTextColor:       '#c8cae0',

          fontSize: '14px',
          fontFamily: 'cerebri, "Segoe UI", system-ui, sans-serif',

          actorBorder: '#7a8fd4',
          actorBkg: '#1b2640',
          actorTextColor: '#e8ecff',
          actorLineColor: '#5f72b4',
          signalColor: '#98adf2',
          signalTextColor: '#e8ecff',
          labelBoxBkgColor: '#1b2640',
          labelBoxBorderColor: '#5f72b4',
          labelTextColor: '#d3dbf9',
          noteBkgColor: '#22304d',
          noteBorderColor: '#5f72b4',
          noteTextColor: '#d3dbf9',
          activationBorderColor: '#7a8fd4',
          activationBkgColor: '#22304d',

          // ER
          attributeBackgroundColorEven: '#1b2640',
          attributeBackgroundColorOdd: '#22304d',

          pie1: '#6b7ab5',
          pie2: '#4a8fa8',
          pie3: '#5a9e7a',
          pie4: '#8a6bab',
          pie5: '#b57a4a',
          pie6: '#ab4a6b',
          pie7: '#4a6bab',
          pie8: '#7aab5a',
          pieTextColor: '#e8ecff',
          pieLegendTextColor: '#d3dbf9',
          pieSectionTextColor: '#ffffff',

          sectionBkgColor: '#172035',
          altSectionBkgColor: '#111a2c',
          sectionBkgColor2: '#1b2640',
          taskBorderColor: '#7a8fd4',
          taskBkgColor: '#263654',
          taskTextColor: '#e8ecff',
          taskTextOutsideColor: '#d3dbf9',
          taskTextClickableColor: '#a8b8f8',
          activeTaskBorderColor: '#95a8ee',
          activeTaskBkgColor: '#30456b',
          gridColor: '#27324a',
          doneTaskBkgColor: '#172035',
          doneTaskBorderColor: '#5f72b4',
          critBorderColor: '#8b3a4a',
          critBkgColor: '#2a1a20',
          todayLineColor: '#8fa3ea',

          git0: '#6b7ab5',
          git1: '#4a8fa8',
          git2: '#5a9e7a',
          git3: '#8a6bab',
          git4: '#b57a4a',
          git5: '#ab4a6b',
          git6: '#4a6bab',
          git7: '#7aab5a',
          gitBranchLabel0: '#ffffff',
          gitBranchLabel1: '#ffffff',
          gitBranchLabel2: '#ffffff',
          gitBranchLabel3: '#ffffff',
          gitBranchLabel4: '#ffffff',
          gitBranchLabel5: '#ffffff',
          gitBranchLabel6: '#ffffff',
          gitBranchLabel7: '#ffffff',
          commitLabelColor: '#d3dbf9',
          commitLabelBackground: '#1b2640',
          tagLabelColor: '#ffffff',
          tagLabelBackground: '#7a8fd4',
          tagLabelBorder: '#5f72b4',
        }
      : {
          background: '#ffffff',
          mainBkg: '#f6f7fb',
          primaryColor: '#edf0fa',
          primaryTextColor: '#1a1c2e',
          primaryBorderColor: '#9098c8',

          secondaryColor: '#f0f2fb',
          secondaryTextColor: '#2a2d45',
          secondaryBorderColor: '#b8bcd8',

          tertiaryColor: '#f8f9fd',
          tertiaryTextColor: '#2a2d45',
          tertiaryBorderColor: '#c8cade',

          lineColor: '#8890c0',
          edgeLabelBackground: '#edf0fa',

          clusterBkg: '#f0f2fb',
          clusterBorder: '#c0c4de',

          nodeTextColor: '#1a1c2e',

          fontSize: '14px',
          fontFamily: 'cerebri, "Segoe UI", system-ui, sans-serif',

          actorBorder: '#9098c8',
          actorBkg: '#edf0fa',
          actorTextColor: '#1a1c2e',
          actorLineColor: '#b8bcd8',
          signalColor: '#6870a8',
          signalTextColor: '#1a1c2e',
          labelBoxBkgColor: '#edf0fa',
          labelBoxBorderColor: '#c0c4de',
          noteBkgColor: '#e8f6fe',
          noteBorderColor: '#7dd3fc',
          noteTextColor: '#0c4a6e',
          activationBorderColor: '#9098c8',
          activationBkgColor: '#dde2f8',

          // ER
          attributeBackgroundColorEven: '#f0f2fb',
          attributeBackgroundColorOdd: '#f8f9fd',

          pie1: '#5a6aa8',
          pie2: '#3a7e9a',
          pie3: '#4a8e6a',
          pie4: '#7a5a9a',
          pie5: '#a56a3a',
          pie6: '#9a3a5a',
          pie7: '#3a5a9a',
          pie8: '#6a9a4a',
          pieTextColor: '#1a1c2e',
          pieLegendTextColor: '#2a2d45',
          pieSectionTextColor: '#ffffff',

          sectionBkgColor: '#f0f2fb',
          altSectionBkgColor: '#f8f9fd',
          sectionBkgColor2: '#edf0fa',
          taskBorderColor: '#9098c8',
          taskBkgColor: '#dde2f8',
          taskTextColor: '#1a1c2e',
          taskTextOutsideColor: '#2a2d45',
          taskTextClickableColor: '#3a45a0',
          activeTaskBorderColor: '#6870a8',
          activeTaskBkgColor: '#c8d0f0',
          gridColor: '#e0e2f0',
          doneTaskBkgColor: '#f0f2fb',
          doneTaskBorderColor: '#c0c4de',
          critBorderColor: '#c05060',
          critBkgColor: '#fce8ea',
          todayLineColor: '#5a6aa8',

          git0: '#5a6aa8',
          git1: '#3a7e9a',
          git2: '#4a8e6a',
          git3: '#7a5a9a',
          git4: '#a56a3a',
          git5: '#9a3a5a',
          git6: '#3a5a9a',
          git7: '#6a9a4a',
          gitBranchLabel0: '#ffffff',
          gitBranchLabel1: '#ffffff',
          gitBranchLabel2: '#ffffff',
          gitBranchLabel3: '#ffffff',
          gitBranchLabel4: '#ffffff',
          gitBranchLabel5: '#ffffff',
          gitBranchLabel6: '#ffffff',
          gitBranchLabel7: '#ffffff',
          commitLabelColor: '#2a2d45',
          commitLabelBackground: '#edf0fa',
          tagLabelColor: '#ffffff',
          tagLabelBackground: '#5a6aa8',
          tagLabelBorder: '#3a4888',
        },
    flowchart: {
      curve: 'basis',
      padding: 16,
      nodeSpacing: 42,
      rankSpacing: 54,
      htmlLabels: true,
      useMaxWidth: false,
    },
    sequence: { actorMargin: 44, boxMargin: 10, messageMargin: 36, mirrorActors: false, useMaxWidth: false },
    gantt: { barHeight: 22, barGap: 5, topPadding: 36, leftPadding: 72, gridLineStartPadding: 36 },
    er: { layoutDirection: 'TB', useMaxWidth: true },
  });
};

const getThemeMode = (): MermaidThemeMode => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

const isMermaidErrorSvg = (svg: string) =>
  /aria-roledescription=["']error["']/.test(svg) || /class=["']error-icon["']/.test(svg);

const extractMermaidErrorMessage = (svg: string) => {
  const textMatch = svg.match(/<text[^>]*>([^<]+)<\/text>/);
  return textMatch?.[1]?.trim() || 'Unable to render diagram. Please check syntax.';
};

const cleanupMermaidRenderHost = (renderId: string) => {
  document.getElementById(`d${renderId}`)?.remove();
};

const getSvgSize = (svgEl: SVGSVGElement) => {
  const viewBox = svgEl
    .getAttribute('viewBox')
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  const viewBoxWidth = viewBox?.length === 4 && Number.isFinite(viewBox[2]) ? viewBox[2] : 0;
  const viewBoxHeight = viewBox?.length === 4 && Number.isFinite(viewBox[3]) ? viewBox[3] : 0;
  const attrWidth = Number.parseFloat(svgEl.getAttribute('width') ?? '');
  const attrHeight = Number.parseFloat(svgEl.getAttribute('height') ?? '');

  return {
    width: viewBoxWidth || (Number.isFinite(attrWidth) ? attrWidth : 640),
    height: viewBoxHeight || (Number.isFinite(attrHeight) ? attrHeight : 360),
  };
};

const roundMermaidCorners = (svgEl: SVGSVGElement) => {
  svgEl.querySelectorAll('rect').forEach((el) => {
    const rect = el as SVGRectElement;
    const width = Number.parseFloat(rect.getAttribute('width') ?? '');
    const height = Number.parseFloat(rect.getAttribute('height') ?? '');
    const radius = Number.isFinite(width) && Number.isFinite(height) && Math.min(width, height) < 18 ? 4 : 8;

    rect.setAttribute('rx', String(radius));
    rect.setAttribute('ry', String(radius));
  });

  svgEl.querySelectorAll('foreignObject div, .nodeLabel, .edgeLabel, .labelBkg').forEach((el) => {
    (el as HTMLElement | SVGElement).style.borderRadius = '8px';
  });
};

const polishSvg = (svgEl: SVGSVGElement, isDark: boolean) => {
  const { width, height } = getSvgSize(svgEl);
  const aspectRatio = width > 0 ? height / width : 1;
  const targetWidth = Math.min(Math.max(width, 360), aspectRatio > 1.35 ? 760 : 940);

  svgEl.removeAttribute('width');
  svgEl.removeAttribute('height');
  svgEl.setAttribute('role', 'img');
  svgEl.setAttribute('aria-label', 'Mermaid diagram');
  svgEl.style.display = 'block';
  svgEl.style.width = `${targetWidth}px`;
  svgEl.style.maxWidth = '100%';
  svgEl.style.maxHeight = 'min(72vh, 680px)';
  svgEl.style.height = 'auto';
  svgEl.style.marginInline = 'auto';
  svgEl.style.backgroundColor = 'transparent';
  svgEl.style.objectFit = 'contain';
  svgEl.style.overflow = 'visible';

  roundMermaidCorners(svgEl);

  svgEl.querySelectorAll('.edgePath path, .flowchart-link, .messageLine0, .messageLine1').forEach((el) => {
    (el as SVGElement).style.strokeWidth = '1.7px';
    if (isDark) (el as SVGElement).style.stroke = '#8fa3ea';
  });

  svgEl.querySelectorAll('.edgeLabel text, .messageText, .loopText, .labelText').forEach((el) => {
    (el as SVGElement).style.fontSize = '12px';
    (el as SVGElement).style.fontWeight = '500';
    if (isDark) (el as SVGElement).style.fill = '#dbe3ff';
  });

  svgEl.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon, .cluster rect').forEach((el) => {
    (el as SVGElement).style.strokeWidth = '1.6px';
  });

  if (isDark) {
    svgEl.querySelectorAll('.cluster rect').forEach((el) => {
      (el as SVGElement).style.fill = '#111a2c';
      (el as SVGElement).style.stroke = '#5f72b4';
    });

    svgEl.querySelectorAll('.edgeLabel rect, .labelBkg').forEach((el) => {
      (el as SVGElement).style.fill = '#1b2640';
      (el as SVGElement).style.stroke = '#5f72b4';
    });

    svgEl.querySelectorAll('marker path').forEach((el) => {
      (el as SVGElement).style.fill = '#8fa3ea';
      (el as SVGElement).style.stroke = '#8fa3ea';
    });
  }
};

const MermaidRenderer = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const errorBoxRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [themeMode, setThemeMode] = useState<MermaidThemeMode>(() => getThemeMode());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeMode(getThemeMode());
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    let isCancelled = false;
    let renderId: string | null = null;
    const el = ref.current;
    const isDark = themeMode === 'dark';
    const cacheKey = `${themeMode}:${chart}`;

    void (async () => {
      const api = await ensureMermaid();
      if (isCancelled || !ref.current) return;

      initMermaid(api, isDark);
      el.innerHTML = '';
      if (errorRef.current) errorRef.current.textContent = '';
      if (errorBoxRef.current) errorBoxRef.current.hidden = true;

      const cachedSvg = renderedDiagramCache.get(cacheKey);
      if (cachedSvg) {
        if (isMermaidErrorSvg(cachedSvg)) {
          renderedDiagramCache.delete(cacheKey);
        } else {
          el.innerHTML = cachedSvg;
          const svgEl = el.querySelector('svg');
          if (svgEl) polishSvg(svgEl, isDark);
          return;
        }
      }

      const id = 'mermaid-' + Math.random().toString(36).slice(2);
      renderId = id;
      try {
        const { svg } = await api.render(id, chart);
        cleanupMermaidRenderHost(id);
        if (!ref.current || isCancelled) return;

        if (isMermaidErrorSvg(svg)) {
          ref.current.innerHTML = '';
          if (errorBoxRef.current) errorBoxRef.current.hidden = false;
          if (errorRef.current) errorRef.current.textContent = extractMermaidErrorMessage(svg);
          return;
        }

        cacheRenderedDiagram(cacheKey, svg);
        ref.current.innerHTML = svg;
        const svgEl = ref.current.querySelector('svg');
        if (svgEl) polishSvg(svgEl, isDark);
      } catch (renderError: unknown) {
        cleanupMermaidRenderHost(id);
        if (isCancelled) return;
        if (ref.current) ref.current.innerHTML = '';
        if (errorBoxRef.current) errorBoxRef.current.hidden = false;
        if (errorRef.current) {
          errorRef.current.textContent =
            renderError instanceof Error ? renderError.message : 'Unable to render diagram. Please check syntax.';
        }
      }
    })();

    return () => {
      isCancelled = true;
      if (renderId) cleanupMermaidRenderHost(renderId);
    };
  }, [chart, themeMode]);

  return (
    <figure className="md-mermaid-card overflow-hidden rounded-[0.625rem] border border-border/45 bg-card">
      <div className="flex items-center gap-2 border-b border-border/45 bg-muted/30 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        <span>Diagram</span>
      </div>
      <div className="max-h-[min(72vh,42.5rem)] overflow-auto bg-muted/40 p-3 sm:p-4 dark:bg-slate-950/35">
        <div ref={ref} className="min-w-0 [&_svg_*]:font-sans" />
        <div
          ref={errorBoxRef}
          hidden
          className="rounded-lg border border-red-200/70 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
        >
          <span>Unable to render this Mermaid diagram.</span>
          <span ref={errorRef} className="mt-1 block text-xs opacity-80" />
        </div>
      </div>
    </figure>
  );
};

export default memo(MermaidRenderer);
