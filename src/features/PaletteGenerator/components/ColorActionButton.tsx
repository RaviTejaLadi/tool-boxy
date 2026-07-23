import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ColorActionButton({
  icon: Icon,
  onClick,
  active,
  title,
  danger,
}: {
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  title: string;
  danger?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        'size-8 shrink-0',
        active && 'border-primary/40 bg-primary/10 text-primary',
        danger && 'hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive'
      )}
    >
      <Icon className="size-3.5" />
    </Button>
  );
}
