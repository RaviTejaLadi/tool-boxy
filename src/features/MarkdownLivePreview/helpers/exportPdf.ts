import { PRINT_STYLES } from '../constants';

export function exportPreviewPdf(content: HTMLElement | null) {
  if (!content) return;

  const html = content.innerHTML;
  if (!html.trim()) return;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  Object.assign(iframe.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '0',
    height: '0',
    border: '0',
    visibility: 'hidden',
  });
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDoc = frameWindow?.document;
  if (!frameWindow || !frameDoc) {
    iframe.remove();
    return;
  }

  frameDoc.open();
  frameDoc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Markdown Preview</title>
    <style>${PRINT_STYLES}</style>
  </head>
  <body>${html}</body>
</html>`);
  frameDoc.close();

  const cleanup = () => {
    iframe.remove();
  };

  frameWindow.addEventListener('afterprint', cleanup);

  // Allow layout to settle before opening the print dialog
  window.setTimeout(() => {
    frameWindow.focus();
    frameWindow.print();
  }, 100);

  // Fallback if afterprint never fires (some browsers)
  window.setTimeout(cleanup, 60_000);
}
