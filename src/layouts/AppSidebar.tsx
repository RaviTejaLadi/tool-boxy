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
import { toolCategories, tools, toolsByCategory } from '@/config/tools';
import { useToolFavorites } from '@/hooks/use-tool-favorites';

const navTitle = (title: string) => (title === 'Tailwind Shade Generator' ? 'Tailwind Shades' : title);

export type AppSidebarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar(props: AppSidebarProps) {
  const [query, setQuery] = useState('');
  const { favorites, isFavorite, toggleFavorite } = useToolFavorites();

  const normalizedQuery = query.trim().toLowerCase();

  const favoriteItems = useMemo(() => {
    return favorites
      .map((url) => tools.find((tool) => tool.url === url))
      .filter((tool): tool is (typeof tools)[number] => Boolean(tool))
      .filter((tool) => {
        if (!normalizedQuery) return true;
        return (
          tool.title.toLowerCase().includes(normalizedQuery) ||
          tool.description.toLowerCase().includes(normalizedQuery) ||
          tool.category.toLowerCase().includes(normalizedQuery)
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
  }, [favorites, normalizedQuery]);

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

  const hasResults = favoriteItems.length > 0 || filteredByCategory.some((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_14px_color-mix(in_oklab,var(--sidebar-primary)_40%,transparent)]">
                <PackageIcon weight="fill" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-heading font-semibold tracking-tight">Tool Boxy</span>
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
          <>
            <NavMain
              label="Favorites"
              items={favoriteItems}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
            {filteredByCategory
              .filter(({ items }) => items.length > 0)
              .map(({ category, items }) => (
                <NavMain
                  key={category}
                  label={category}
                  items={items}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
          </>
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
