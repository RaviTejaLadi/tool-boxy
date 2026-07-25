import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { toolCategories, tools, toolsByCategory, type Tool } from '@/config/tools';

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Link
      to={tool.url}
      className="group relative flex gap-2.5 rounded-md border border-border bg-card/60 p-3 transition-colors hover:border-primary/40 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
        <Icon className="size-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-heading text-sm font-medium tracking-tight group-hover:text-primary">
            {tool.title}
          </span>
          {tool.badge ? (
            <Badge variant="secondary" className="h-4 shrink-0 px-1.5 text-[10px] uppercase tracking-wide">
              {tool.badge}
            </Badge>
          ) : null}
          <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">{tool.description}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="relative mx-auto w-full max-w-5xl pt-6 pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-4 h-56 bg-[radial-gradient(ellipse_at_top,oklch(0.88_0.06_230_/0.55),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.35_0.06_240_/0.45),transparent_70%)]"
      />

      <section className="relative flex flex-col gap-4 border-b border-border pb-10">
        <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">Tool Boxy</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          A collection of small, focused utilities for developers, designers, and creators. Fast, frictionless, and
          ready when you need them — no tab sprawl required.
        </p>
        <p className="font-mono text-xs text-muted-foreground">{tools.length} tools · runs in your browser</p>
      </section>

      {/* <section className="relative mt-10 flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-medium tracking-tight">Greatest Hits</h2>
            <p className="mt-1 text-sm text-muted-foreground">The tools you&apos;ll reach for most.</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">{featuredTools.length}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.url} tool={tool} featured />
          ))}
        </div>
      </section> */}

      <section className="relative mt-14 flex flex-col gap-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-medium tracking-tight">All Tools</h2>
            <p className="mt-1 text-sm text-muted-foreground">Everything currently in the box.</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">{tools.length}</span>
        </div>

        <div className="flex flex-col gap-10">
          {toolCategories.map((category) => {
            const categoryTools = toolsByCategory(category);

            return (
              <div key={category} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
                  <h3 className="font-heading text-sm font-semibold tracking-tight">{category}</h3>
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {categoryTools.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.url} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
