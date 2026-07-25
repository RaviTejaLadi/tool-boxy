export const HISTORY_LIMIT = 50;

export const EDITOR_FONT_SIZE = 13;
export const EDITOR_LINE_HEIGHT = 24;
export const EDITOR_GUTTER_BG = 'color-mix(in oklab, var(--muted) 60%, var(--background))';

/** Highlighting is skipped past this size so typing stays responsive. */
export const MAX_HIGHLIGHT_LENGTH = 120_000;

export const DEFAULT_HTML = `<div class="min-h-full bg-slate-50 p-8">
  <div class="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-sky-600">HTML Viewer</p>
    <h1 class="mt-2 text-3xl font-bold text-slate-900">Hello World</h1>
    <p class="mt-4 leading-relaxed text-slate-600">
      Paste HTML on the left to preview it live. Tailwind utility classes work out of the box.
    </p>
    <div class="mt-6 flex flex-wrap gap-3">
      <button class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
        Primary action
      </button>
      <button class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        Secondary
      </button>
    </div>
  </div>
</div>
`;
