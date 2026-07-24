import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { toolCategories, tools, toolsByCategory, type Tool } from '@/config/tools';
// import { cn } from '@/lib/utils';

// function ToolCard({ tool, featured = false }: { tool: Tool; featured?: boolean }) {
//   const Icon = tool.icon;

//   return (
//     <Link
//       to={tool.url}
//       className={cn(
//         'group relative flex flex-col gap-3 border border-border bg-card/60 p-4 transition-colors',
//         'hover:border-primary/40 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
//         featured && 'min-h-36 justify-between'
//       )}
//     >
//       <div className="flex items-start justify-between gap-3">
//         <div className="flex size-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
//           <Icon className="size-4" />
//         </div>
//         <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
//       </div>

//       <div className="flex flex-col gap-1.5">
//         <div className="flex flex-wrap items-center gap-2">
//           <span className="font-heading text-sm font-semibold tracking-tight">{tool.title}</span>
//           {tool.badge ? (
//             <Badge variant="secondary" className="h-4 px-1.5 text-[10px] uppercase tracking-wide">
//               {tool.badge}
//             </Badge>
//           ) : null}
//         </div>
//         <p className="text-xs leading-relaxed text-muted-foreground">{tool.description}</p>
//       </div>
//     </Link>
//   );
// }

function ToolRow({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Link
      to={tool.url}
      className="group flex items-start gap-3 border-b border-border/70 py-3 transition-colors last:border-b-0 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center bg-secondary text-secondary-foreground">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-sm font-medium tracking-tight group-hover:text-primary">{tool.title}</span>
          {tool.badge ? (
            <Badge variant="outline" className="h-4 px-1.5 text-[10px] uppercase tracking-wide">
              {tool.badge}
            </Badge>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{tool.description}</p>
      </div>
      <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
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
                <div className="flex flex-col">
                  {categoryTools.map((tool) => (
                    <ToolRow key={tool.url} tool={tool} />
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
