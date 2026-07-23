import { Link, useLocation } from 'react-router-dom';
import { CaretRightIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

type NavMainSubItem = {
  title: string;
  url: string;
};

type NavMainItem = {
  title: string;
  url: string;
  icon?: ReactNode;
  isActive?: boolean;
  items?: NavMainSubItem[];
};

export type NavMainProps = {
  items: NavMainItem[];
};

export function NavMain({ items }: NavMainProps) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = Boolean(item.items?.length);

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname === item.url}
                  render={<Link to={item.url} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          const isOpen =
            item.isActive || item.url === pathname || item.items?.some((subItem) => subItem.url === pathname);

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isOpen}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
                {item.icon}
                <span>{item.title}</span>
                <CaretRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton isActive={pathname === subItem.url} render={<Link to={subItem.url} />}>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
