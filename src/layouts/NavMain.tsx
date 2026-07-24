import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

type NavMainItem = {
  title: string;
  url: string;
  icon?: ReactNode;
};

export type NavMainProps = {
  label: string;
  items: NavMainItem[];
};

export function NavMain({ label, items }: NavMainProps) {
  const { pathname } = useLocation();

  if (items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url} render={<Link to={item.url} />}>
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
