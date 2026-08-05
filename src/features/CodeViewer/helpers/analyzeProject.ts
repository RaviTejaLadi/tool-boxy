import { getExtension, getLanguage, type FileNode } from './fileTree';
import { flattenFiles, flattenTextFiles } from './flattenFiles';

export type LanguageStat = {
  language: string;
  files: number;
  lines: number;
  bytes: number;
};

export type ProjectInsights = {
  totalFiles: number;
  textFiles: number;
  assetFiles: number;
  totalBytes: number;
  totalLines: number;
  codeLines: number;
  blankLines: number;
  commentLines: number;
  languages: LanguageStat[];
  largestFiles: Array<{ path: string; name: string; bytes: number; lines: number }>;
};

export type GrepHit = {
  path: string;
  name: string;
  line: number;
  preview: string;
};

export type FindingKind = 'TODO' | 'FIXME' | 'HACK' | 'BUG' | 'NOTE' | 'SECRET';

export type Finding = {
  id: string;
  kind: FindingKind;
  path: string;
  name: string;
  line: number;
  preview: string;
};

export type OutlineSymbol = {
  name: string;
  kind: 'function' | 'class' | 'component' | 'export' | 'type';
  line: number;
};

const COMMENT_LINE = /^\s*(\/\/|#|--|\/\*|\*)/;
const TODO_RE = /\b(TODO|FIXME|HACK|BUG|NOTE)\b\s*:?\s*(.*)$/i;

const SECRET_PATTERNS: Array<{ label: string; re: RegExp }> = [
  { label: 'AWS key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: 'Private key', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { label: 'GitHub token', re: /\bghp_[A-Za-z0-9]{20,}\b/ },
  { label: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { label: 'Generic secret', re: /\b(?:api[_-]?key|secret|password|token)\b\s*[:=]\s*['"][^'"]{8,}['"]/i },
];

function countLineKinds(content: string) {
  let codeLines = 0;
  let blankLines = 0;
  let commentLines = 0;
  for (const line of content.split('\n')) {
    if (!line.trim()) blankLines += 1;
    else if (COMMENT_LINE.test(line)) commentLines += 1;
    else codeLines += 1;
  }
  return { codeLines, blankLines, commentLines, totalLines: content.split('\n').length };
}

export function computeInsights(root: FileNode | null): ProjectInsights | null {
  if (!root) return null;
  const files = flattenFiles(root);
  const textFiles = flattenTextFiles(root);

  const languageMap = new Map<string, LanguageStat>();
  let totalBytes = 0;
  let totalLines = 0;
  let codeLines = 0;
  let blankLines = 0;
  let commentLines = 0;

  for (const file of files) {
    totalBytes += file.size ?? 0;
  }

  for (const file of textFiles) {
    const content = file.content ?? '';
    const counts = countLineKinds(content);
    totalLines += counts.totalLines;
    codeLines += counts.codeLines;
    blankLines += counts.blankLines;
    commentLines += counts.commentLines;

    const language = getLanguage(file.name);
    const current = languageMap.get(language) ?? { language, files: 0, lines: 0, bytes: 0 };
    current.files += 1;
    current.lines += counts.totalLines;
    current.bytes += file.size ?? content.length;
    languageMap.set(language, current);
  }

  const languages = [...languageMap.values()].sort((a, b) => b.lines - a.lines || b.files - a.files);
  const largestFiles = textFiles
    .map((file) => ({
      path: file.path ?? file.name,
      name: file.name,
      bytes: file.size ?? file.content?.length ?? 0,
      lines: (file.content ?? '').split('\n').length,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);

  return {
    totalFiles: files.length,
    textFiles: textFiles.length,
    assetFiles: files.length - textFiles.length,
    totalBytes,
    totalLines,
    codeLines,
    blankLines,
    commentLines,
    languages,
    largestFiles,
  };
}

export function grepFiles(
  root: FileNode | null,
  query: string,
  options: { caseSensitive?: boolean; maxResults?: number } = {}
): GrepHit[] {
  const q = query.trim();
  if (!root || !q) return [];

  const caseSensitive = options.caseSensitive ?? false;
  const maxResults = options.maxResults ?? 200;
  const needle = caseSensitive ? q : q.toLowerCase();
  const hits: GrepHit[] = [];

  for (const file of flattenTextFiles(root)) {
    const lines = (file.content ?? '').split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const haystack = caseSensitive ? line : line.toLowerCase();
      if (!haystack.includes(needle)) continue;
      hits.push({
        path: file.path ?? file.name,
        name: file.name,
        line: i + 1,
        preview: line.trim().slice(0, 160),
      });
      if (hits.length >= maxResults) return hits;
    }
  }

  return hits;
}

export function scanFindings(root: FileNode | null, maxPerKind = 80): Finding[] {
  if (!root) return [];
  const findings: Finding[] = [];
  const kindCount: Record<string, number> = {};

  for (const file of flattenTextFiles(root)) {
    const lines = (file.content ?? '').split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];

      const todoMatch = line.match(TODO_RE);
      if (todoMatch) {
        const kind = todoMatch[1].toUpperCase() as FindingKind;
        if (kind === 'SECRET') continue;
        kindCount[kind] = (kindCount[kind] ?? 0) + 1;
        if ((kindCount[kind] ?? 0) <= maxPerKind) {
          findings.push({
            id: `${file.path}:${i + 1}:${kind}`,
            kind,
            path: file.path ?? file.name,
            name: file.name,
            line: i + 1,
            preview: (todoMatch[2] || line.trim()).slice(0, 140),
          });
        }
      }

      for (const pattern of SECRET_PATTERNS) {
        if (!pattern.re.test(line)) continue;
        kindCount.SECRET = (kindCount.SECRET ?? 0) + 1;
        if ((kindCount.SECRET ?? 0) <= maxPerKind) {
          findings.push({
            id: `${file.path}:${i + 1}:SECRET:${pattern.label}`,
            kind: 'SECRET',
            path: file.path ?? file.name,
            name: file.name,
            line: i + 1,
            preview: `${pattern.label} · ${line.trim().slice(0, 100)}`,
          });
        }
        break;
      }
    }
  }

  const order: FindingKind[] = ['SECRET', 'BUG', 'FIXME', 'HACK', 'TODO', 'NOTE'];
  return findings.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.path.localeCompare(b.path));
}

export function extractOutline(file: FileNode | null): OutlineSymbol[] {
  if (!file?.content || (file.kind !== 'text' && file.kind !== 'svg')) return [];
  const ext = getExtension(file.name);
  const lines = file.content.split('\n');
  const symbols: OutlineSymbol[] = [];

  const push = (name: string, kind: OutlineSymbol['kind'], line: number) => {
    if (!name || symbols.length >= 80) return;
    symbols.push({ name, kind, line });
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const n = i + 1;

    if (/\.(tsx|jsx)$/.test(file.name) || ext === 'tsx' || ext === 'jsx') {
      const comp = line.match(/^(?:export\s+)?(?:default\s+)?function\s+([A-Z][A-Za-z0-9_]*)/);
      if (comp) {
        push(comp[1], 'component', n);
        continue;
      }
      const arrowComp = line.match(
        /^(?:export\s+)?const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*(?:\([^)]*\)|[A-Za-z0-9_]+)\s*=>/
      );
      if (arrowComp) {
        push(arrowComp[1], 'component', n);
        continue;
      }
    }

    const fn =
      line.match(/^(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/) ||
      line.match(/^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/) ||
      line.match(/^\s*(?:async\s+)?([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/) ||
      line.match(/^def\s+([A-Za-z_][\w]*)\s*\(/) ||
      line.match(/^(?:pub\s+)?(?:async\s+)?fn\s+([A-Za-z_][\w]*)/);
    if (fn) {
      push(fn[1], 'function', n);
      continue;
    }

    const cls =
      line.match(/^(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)/) ||
      line.match(/^class\s+([A-Za-z_][\w]*)\s*[:\(]/);
    if (cls) {
      push(cls[1], 'class', n);
      continue;
    }

    const type = line.match(/^(?:export\s+)?(?:type|interface|enum)\s+([A-Za-z_$][\w$]*)/);
    if (type) {
      push(type[1], 'type', n);
      continue;
    }

    const exp = line.match(
      /^export\s+(?:default\s+)?(?:const|let|var|class|function|type|interface)\s+([A-Za-z_$][\w$]*)/
    );
    if (exp) push(exp[1], 'export', n);
  }

  return symbols;
}

export function buildProjectReport(root: FileNode, folderName: string): string {
  const insights = computeInsights(root);
  const findings = scanFindings(root, 40);
  if (!insights) return `# ${folderName}\n\nNo data.\n`;

  const langRows = insights.languages
    .slice(0, 12)
    .map((l) => `| ${l.language} | ${l.files} | ${l.lines} |`)
    .join('\n');

  const findingRows = findings
    .slice(0, 40)
    .map((f) => `| ${f.kind} | \`${f.path}:${f.line}\` | ${f.preview.replace(/\|/g, '\\|')} |`)
    .join('\n');

  return [
    `# ${folderName} — Code Viewer Report`,
    '',
    `Generated locally in the browser · ${new Date().toISOString()}`,
    '',
    '## Snapshot',
    '',
    `- Files: **${insights.totalFiles}** (${insights.textFiles} text · ${insights.assetFiles} assets)`,
    `- Size: **${insights.totalBytes}** bytes`,
    `- Lines: **${insights.totalLines}** (${insights.codeLines} code · ${insights.commentLines} comments · ${insights.blankLines} blank)`,
    '',
    '## Languages',
    '',
    '| Language | Files | Lines |',
    '| --- | ---: | ---: |',
    langRows || '| — | 0 | 0 |',
    '',
    '## Largest text files',
    '',
    ...insights.largestFiles.map((f) => `- \`${f.path}\` — ${f.lines} lines · ${f.bytes} bytes`),
    '',
    '## Findings (TODO / secrets)',
    '',
    '| Kind | Location | Preview |',
    '| --- | --- | --- |',
    findingRows || '| — | — | No findings |',
    '',
  ].join('\n');
}

export function buildLlmDigest(root: FileNode, folderName: string, maxChars = 120_000): string {
  const files = flattenTextFiles(root)
    .slice()
    .sort((a, b) => (a.path ?? '').localeCompare(b.path ?? ''));

  const parts = [
    `# ${folderName} codebase digest`,
    '',
    'Packed for LLM context. Binary/assets omitted. Paths are relative.',
    '',
  ];

  let used = parts.join('\n').length;
  for (const file of files) {
    const path = file.path ?? file.name;
    const body = file.content ?? '';
    const chunk = [`## FILE: ${path}`, '```', body.slice(0, 12_000), '```', ''].join('\n');
    if (used + chunk.length > maxChars) {
      parts.push('', `_Truncated after ${parts.length} sections to stay under ${maxChars} chars._`);
      break;
    }
    parts.push(chunk);
    used += chunk.length;
  }

  return parts.join('\n');
}
