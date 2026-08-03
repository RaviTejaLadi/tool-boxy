/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { SyntaxHighlight } from '@/components/SyntaxHighlight';
import { AlertTriangle, Check, Copy, ExternalLink, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MermaidChartLazy from './MermaidChartLazy';
import { cn } from '@/lib/utils';

function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join(' ');
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return extractTextFromNode(element.props.children);
  }
  return '';
}

function headingSlugFromNode(node: React.ReactNode): string {
  return extractTextFromNode(node)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const LANGUAGE_LABELS: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  python: 'Python',
  py: 'Python',
  sql: 'SQL',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  markdown: 'Markdown',
  mermaid: 'Diagram',
};

function languageLabel(lang: string): string {
  return LANGUAGE_LABELS[lang.toLowerCase()] ?? lang.charAt(0).toUpperCase() + lang.slice(1);
}

type GfmAlert = { kind: string; body: React.ReactNode };

function parseGfmAlert(children: React.ReactNode): GfmAlert | null {
  const nodes = React.Children.toArray(children);
  if (nodes.length === 0) return null;

  const firstText = extractTextFromNode(nodes[0]).trim();
  const match = /^\[!([A-Za-z]+)\]\s*(.*)$/s.exec(firstText);
  if (!match) return null;

  const kind = match[1].toUpperCase();
  const inlineBody = match[2]?.trim();

  if (nodes.length === 1) {
    return { kind, body: inlineBody || null };
  }

  const rest = nodes.slice(1);
  if (inlineBody) {
    return {
      kind,
      body: (
        <>
          <p>{inlineBody}</p>
          {rest}
        </>
      ),
    };
  }

  return { kind, body: rest };
}

const CALLOUT_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  NOTE: Info,
  TIP: Lightbulb,
  IMPORTANT: TriangleAlert,
  WARNING: AlertTriangle,
  CAUTION: AlertTriangle,
};

export type BuildMarkdownComponentsOpts = {
  idPrefix: string;
  isDarkTheme: boolean;
  copiedKey: string | null;
  handleCopy: (key: string, text: string) => void;
  scrollToId: (id: string) => void;
  compactSlide?: boolean;
};

export function buildMarkdownComponents({
  idPrefix,
  isDarkTheme,
  copiedKey,
  handleCopy,
  scrollToId,
  compactSlide = false,
}: BuildMarkdownComponentsOpts): any {
  const nid = (children: React.ReactNode) => `${idPrefix}${headingSlugFromNode(children) || 'section'}`;
  const c = compactSlide;

  return {
    h1: ({ children }: any) => {
      const id = nid(children);
      return (
        <header className="md-h1">
          <h1
            id={id}
            className={cn(
              'scroll-mt-28 font-bold text-foreground',
              c
                ? 'text-[1.6rem] sm:text-[1.8rem] leading-[1.22] tracking-[-0.02em]'
                : 'text-[1.75rem] sm:text-[2.125rem] lg:text-[2.35rem] leading-[1.18] tracking-tight'
            )}
          >
            <span className="md-h1-title">{children}</span>
          </h1>
        </header>
      );
    },
    h2: ({ children }: any) => {
      const id = nid(children);
      return (
        <div className="md-h2 group">
          <div className="md-h2-row">
            <div className="md-h2-num" aria-hidden />
            <h2
              id={id}
              className={cn(
                'scroll-mt-28 font-semibold text-foreground',
                c
                  ? 'text-[1.125rem] sm:text-[1.25rem] leading-snug'
                  : 'text-[1.25rem] sm:text-[1.4rem] leading-snug tracking-[-0.01em]'
              )}
            >
              {children}
            </h2>
          </div>
        </div>
      );
    },
    h3: ({ children }: any) => {
      const id = nid(children);
      return (
        <div className="md-h3">
          <span className="md-h3-mark" aria-hidden />
          <h3
            id={id}
            className={cn(
              'scroll-mt-28 font-semibold text-foreground',
              c ? 'text-[1.05rem] sm:text-[1.125rem] leading-snug' : 'text-[1.125rem] sm:text-[1.2rem] leading-snug'
            )}
          >
            {children}
          </h3>
        </div>
      );
    },
    h4: ({ children }: any) => {
      const id = nid(children);
      return (
        <div className="md-h4">
          <span className="md-h4-mark" aria-hidden />
          <h4
            id={id}
            className={cn(
              'scroll-mt-28 font-semibold text-foreground',
              c ? 'text-[1rem] leading-snug' : 'text-[1.0625rem] leading-snug'
            )}
          >
            {children}
          </h4>
        </div>
      );
    },
    p: ({ children }: any) => (
      <p className={cn('md-p', c ? 'text-[0.98rem] leading-[1.7]' : 'text-[1rem] leading-[1.72]')}>{children}</p>
    ),
    ul: ({ children }: any) => <ul className="md-ul">{children}</ul>,
    ol: ({ children }: any) => <ol className="md-ol">{children}</ol>,
    li: ({ children, className }: any) => {
      const isTask = (className || '').includes('task-list-item');
      return <li className={cn(isTask && 'md-li-task list-none')}>{children}</li>;
    },
    blockquote: ({ children }: any) => {
      const alert = parseGfmAlert(children);
      if (alert) {
        const Icon = CALLOUT_ICONS[alert.kind] ?? Info;
        return (
          <div className={cn('md-callout', `md-callout--${alert.kind.toLowerCase()}`)} role="note">
            <div className="md-callout-head">
              <span className="md-callout-icon-wrap">
                <Icon className="md-callout-icon" strokeWidth={2.2} />
              </span>
              <span className="md-callout-title">{alert.kind}</span>
            </div>
            <div className="md-callout-body [&_p]:mb-2 [&_p:last-child]:mb-0">{alert.body}</div>
          </div>
        );
      }

      return (
        <blockquote className="md-definition">
          <span className="md-definition-label">Definition</span>
          <div className="md-definition-body [&_p]:mb-2 [&_p:last-child]:mb-0">{children}</div>
        </blockquote>
      );
    },
    table: ({ children }: any) => (
      <div className="md-table-card">
        <div className="md-table-wrap">
          <div className="w-full overflow-x-auto">
            <table className="md-table">{children}</table>
          </div>
        </div>
      </div>
    ),
    thead: ({ children }: any) => <thead>{children}</thead>,
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => <tr>{children}</tr>,
    th: ({ children }: any) => <th>{children}</th>,
    td: ({ children }: any) => <td>{children}</td>,
    a: ({ children, href }: any) => {
      const isExternal = href?.startsWith('http');
      if (href?.startsWith('#')) {
        return (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              scrollToId(href.substring(1));
            }}
            className="md-link"
          >
            {children}
          </a>
        );
      }
      return (
        <a
          href={href}
          className="md-link"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
          {isExternal && <ExternalLink className="ml-0.5 inline-block h-3 w-3 -translate-y-px opacity-60" />}
        </a>
      );
    },
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    kbd: ({ children }: any) => <kbd className="md-kbd">{children}</kbd>,
    hr: () => (
      <div className="md-hr" role="separator">
        <span className="md-hr-dot bg-(--md-sky)" />
        <span className="md-hr-dot bg-(--md-purple)" />
        <span className="md-hr-dot bg-(--md-red)" />
      </div>
    ),
    img: ({ src, alt }: any) => {
      const [altText, caption] = (alt ?? '').split('|').map((s: string) => s.trim());
      return (
        <figure className="md-figure">
          <img src={src} alt={altText} className="md-figure-img" loading="lazy" />
          {caption && <figcaption className="md-figure-caption">{caption}</figcaption>}
        </figure>
      );
    },
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match?.[1];
      const codeString = String(children).replace(/\n$/, '');
      const codeKey = `${idPrefix}${codeString.slice(0, 64)}`;

      if (!inline && language === 'mermaid') {
        return <MermaidChartLazy chart={codeString} />;
      }

      return !inline && match ? (
        <div className="md-code-card group relative">
          <div className="md-code-head">
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="md-code-dot bg-[#ff5f57]" />
              <span className="md-code-dot bg-[#007aff]" />
              <span className="md-code-dot bg-[#28c840]" />
            </div>
            <span className="md-code-lang">{languageLabel(language!)}</span>
          </div>
          <div className="pointer-events-none absolute right-3 top-[3.15rem] z-10 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(codeKey, codeString)}
              className={cn(
                'h-8 gap-1 rounded-sm border border-border/40 bg-card/95 p-2 text-[0.68rem] font-medium',
                isDarkTheme
                  ? 'text-foreground/70 hover:bg-accent/60 hover:text-foreground'
                  : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground'
              )}
              aria-label="Copy code"
            >
              {copiedKey === codeKey ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <div className="md-code-body overflow-x-auto">
            <SyntaxHighlight
              code={codeString}
              language={language}
              className="p-4 text-[0.875rem] leading-[1.65]"
              showLineNumbers={false}
            />
          </div>
        </div>
      ) : (
        <code className="md-inline-code" {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => <>{children}</>,
    input: ({ checked, ...props }: any) => (
      <input className="md-task-checkbox" type="checkbox" checked={checked} disabled {...props} />
    ),
    del: ({ children }: any) => (
      <del className="text-muted-foreground/80 line-through decoration-(--md-red)/60 decoration-1">{children}</del>
    ),
  };
}
