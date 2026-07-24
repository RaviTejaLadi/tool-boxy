import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { CodeIcon, CropIcon, PackageIcon, TerminalIcon } from '@phosphor-icons/react';
import { AudioWaveform, PaletteIcon, Pencil } from 'lucide-react';

import { NavMain } from '@/layouts/NavMain';
import { NavProjects } from '@/layouts/NavProjects';
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
  {
    title: 'Code Snippet',
    url: '/code-snippet',
    icon: <CodeIcon />,
  },
  {
    title: 'Palette Collection',
    url: '/palette-collection',
    icon: <PaletteIcon />,
  },
  {
    title: 'Palette Generator',
    url: '/palette-generator',
    icon: <Pencil />,
  },
  {
    title: 'Tailwind Shades',
    url: '/tailwind-shade-generator',
    icon: <AudioWaveform />,
  },
];

const projects = [
  {
    name: 'Design Engineering',
    url: '/projects/design',
    icon: <CropIcon />,
  },
];

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
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
