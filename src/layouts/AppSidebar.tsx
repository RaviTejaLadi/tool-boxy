import { useMemo, useState, type ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { PackageIcon } from '@phosphor-icons/react';
import { Search } from 'lucide-react';

import { NavMain } from '@/layouts/NavMain';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { toolCategories, toolsByCategory } from '@/config/tools';

const navTitle = (title: string) => (title === 'Tailwind Shade Generator' ? 'Tailwind Shades' : title);

export type AppSidebarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar(props: AppSidebarProps) {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredByCategory = useMemo(() => {
    return toolCategories.map((category) => {
      const items = toolsByCategory(category)
        .filter((tool) => {
          if (!normalizedQuery) return true;
          return (
            tool.title.toLowerCase().includes(normalizedQuery) ||
            tool.description.toLowerCase().includes(normalizedQuery) ||
            category.toLowerCase().includes(normalizedQuery)
          );
        })
        .map((tool) => {
          const Icon = tool.icon;
          return {
            title: navTitle(tool.title),
            url: tool.url,
            icon: <Icon />,
          };
        });

      return { category, items };
    });
  }, [normalizedQuery]);

  const hasResults = filteredByCategory.some((group) => group.items.length > 0);

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
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
            <SidebarInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              aria-label="Search tools"
              className="pl-8"
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {hasResults ? (
          filteredByCategory.map(({ category, items }) => <NavMain key={category} label={category} items={items} />)
        ) : (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
              <p className="px-2 py-1.5 font-mono text-[11px] text-muted-foreground">
                No tools match “{query.trim()}”.
              </p>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
