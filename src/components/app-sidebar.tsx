import type * as React from 'react';
import { Link } from 'react-router-dom';
import { CropIcon, PackageIcon, TerminalIcon } from '@phosphor-icons/react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

const navMain = [
  {
    title: 'Playground',
    url: '/playground',
    icon: <TerminalIcon />,
    items: [{ title: 'History', url: '/playground' }],
  },
];

const projects = [
  {
    name: 'Design Engineering',
    url: '/projects/design',
    icon: <CropIcon />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <span className="truncate text-xs">Toolkit</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
