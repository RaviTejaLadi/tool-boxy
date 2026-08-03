export const HISTORY_LIMIT = 50;

export {
  EDITOR_FONT_SIZE,
  EDITOR_GUTTER_BG,
  EDITOR_LINE_HEIGHT,
  MAX_HIGHLIGHT_LENGTH,
} from '@/components/SyntaxHighlight';

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
