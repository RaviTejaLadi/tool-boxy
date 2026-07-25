import { Link, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { ReactNode } from 'react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type NavMainItem = {
  title: string;
  url: string;
  icon?: ReactNode;
};

export type NavMainProps = {
  label: string;
  items: NavMainItem[];
  isFavorite?: (url: string) => boolean;
  onToggleFavorite?: (url: string) => void;
};

export function NavMain({ label, items, isFavorite, onToggleFavorite }: NavMainProps) {
  const { pathname } = useLocation();

  if (items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const favorited = isFavorite?.(item.url) ?? false;

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url} render={<Link to={item.url} />}>
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {onToggleFavorite ? (
                <SidebarMenuAction
                  showOnHover={!favorited}
                  aria-label={favorited ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
                  aria-pressed={favorited}
                  title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggleFavorite(item.url);
                  }}
                >
                  <Star className={cn('size-3.5', favorited && 'fill-current text-amber-500')} />
                </SidebarMenuAction>
              ) : null}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
