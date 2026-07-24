import { lazy, Suspense } from 'react';

const MermaidRenderer = lazy(() => import('./MermaidRenderer'));

export default function MermaidChartLazy({ chart }: { chart: string }) {
  return (
    <Suspense fallback={<div className="my-6 h-36 animate-pulse rounded-lg bg-muted/40" aria-hidden />}>
      <MermaidRenderer chart={chart} />
    </Suspense>
  );
}
