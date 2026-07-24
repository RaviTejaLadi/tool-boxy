import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { PackageIcon } from '@phosphor-icons/react';

import { NavMain } from '@/layouts/NavMain';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { toolCategories, toolsByCategory } from '@/config/tools';

const navTitle = (title: string) => (title === 'Tailwind Shade Generator' ? 'Tailwind Shades' : title);

export type AppSidebarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar(props: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <PackageIcon />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Tool Boxy</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {toolCategories.map((category) => (
          <NavMain
            key={category}
            label={category}
            items={toolsByCategory(category).map((tool) => {
              const Icon = tool.icon;
              return {
                title: navTitle(tool.title),
                url: tool.url,
                icon: <Icon />,
              };
            })}
          />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
