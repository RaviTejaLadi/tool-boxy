// @ts-nocheck — typed gradually
import { cn } from '@/lib/utils';

export function SectionHeading({ children, className }) {
  return (
    <p className={cn('border-b border-border pb-1 font-mono text-[11px] tracking-wide text-primary', className)}>
      {children}
    </p>
  );
}
