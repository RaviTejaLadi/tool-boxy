export const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 2rem;
    color: #111;
    background: #fff;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    line-height: 1.6;
  }
  h1, h2, h3, h4, h5, h6 {
    margin: 1.25em 0 0.5em;
    line-height: 1.25;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.3em;
  }
  h1 { font-size: 2em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }
  p, ul, ol { margin: 0.75em 0; }
  ul, ol { padding-left: 1.5em; }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
    background: #f3f4f6;
    padding: 0.15em 0.35em;
    border-radius: 0.25rem;
  }
  pre {
    background: #f3f4f6;
    padding: 1rem;
    overflow: auto;
    border-radius: 0.5rem;
  }
  pre code { background: transparent; padding: 0; }
  blockquote {
    margin: 0.75em 0;
    padding-left: 1em;
    border-left: 4px solid #d1d5db;
    color: #4b5563;
  }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid #d1d5db; padding: 0.5em 0.75em; text-align: left; }
  a { color: #2563eb; }
  img { max-width: 100%; }
  @media print {
    body { padding: 0; }
  }
`;
