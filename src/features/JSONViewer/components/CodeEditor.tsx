import { useEffect, useRef } from 'react';
import { EDITOR_FONT_SIZE, EDITOR_GUTTER_BG, EDITOR_LINE_HEIGHT } from '../constants';
import { useTypingCommit } from '../helpers/useTypingCommit';
import { useJsonStore } from '../stores';
import { CodeHighlight } from './CodeHighlight';

export function CodeEditor() {
  const jsonCode = useJsonStore((s) => s.jsonCode);
  const wordWrap = useJsonStore((s) => s.wordWrap);
  const setJsonCode = useJsonStore((s) => s.setJsonCode);
  const undo = useJsonStore((s) => s.undo);
  const redo = useJsonStore((s) => s.redo);
  const scheduleCommit = useTypingCommit();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const lineCount = Math.max(jsonCode.split('\n').length, 1);
  const gutterWidth = `calc(${Math.max(String(lineCount).length, 2)}ch + 1.5rem)`;

  const syncScroll = () => {
    const textarea = textareaRef.current;
    const layer = highlightRef.current;
    if (!textarea || !layer) return;
    layer.scrollTop = textarea.scrollTop;
    layer.scrollLeft = textarea.scrollLeft;
  };

  useEffect(syncScroll, [jsonCode, wordWrap]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();

    if (mod && key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && key === 'y') {
      e.preventDefault();
      redo();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart, selectionEnd } = el;
      const next = `${jsonCode.slice(0, selectionStart)}  ${jsonCode.slice(selectionEnd)}`;
      setJsonCode(next, { history: false });
      scheduleCommit();
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + 2;
      });
    }
  };

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0"
        style={{ width: gutterWidth, background: EDITOR_GUTTER_BG, borderRight: '1px solid var(--border)' }}
      />

      <CodeHighlight code={jsonCode} wordWrap={wordWrap} gutterWidth={gutterWidth} layerRef={highlightRef} />

      <textarea
        ref={textareaRef}
        value={jsonCode}
        onChange={(e) => {
          setJsonCode(e.target.value, { history: false });
          scheduleCommit();
        }}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        spellCheck={false}
        wrap={wordWrap ? 'soft' : 'off'}
        placeholder="Paste your JSON here..."
        aria-label="JSON code editor"
        className="absolute inset-0 size-full resize-none overflow-auto border-0 bg-transparent py-3 pr-4 font-mono text-transparent caret-foreground outline-none selection:bg-primary/30 placeholder:text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          fontSize: EDITOR_FONT_SIZE,
          lineHeight: `${EDITOR_LINE_HEIGHT}px`,
          tabSize: 2,
          paddingLeft: `calc(${gutterWidth} + 1rem)`,
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: wordWrap ? 'break-word' : 'normal',
        }}
      />
    </div>
  );
}
