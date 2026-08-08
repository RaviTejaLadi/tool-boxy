import { Home, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { tools } from '@/config/tools';
import { useToolFavorites } from '@/hooks/use-tool-favorites';
import { AppSidebar } from '@/layouts/AppSidebar';
import { cn } from '@/lib/utils';

const navTitle = (title: string) => (title === 'Tailwind Shade Generator' ? 'Tailwind Shades' : title);

const routesWithFeatureSidebar = new Set([
  '/ascii-art-generator',
  '/animation-generator',
  '/base-converter',
  '/base64-image-encoder',
  '/border-radius-generator',
  '/code-snippet',
  '/code-viewer',
  '/colour-converter',
  '/contrast-checker',
  '/csv-viewer',
  '/document-annotator',
  '/favicon-generator',
  '/glassmorphism-generator',
  '/glyph-browser',
  '/gradient-generator',
  '/image-converter',
  '/image-crop',
  '/image-splitter',
  '/image-stitcher',
  '/jwt-decoder',
  '/lorem-ipsum-generator',
  '/meta-tag-generator',
  '/password-generator',
  '/pdf-toolkit',
  '/placeholder-generator',
  '/post-composer',
  '/qr-code-generator',
  '/uuid-generator',
  '/word-counter',
  '/world-scripts',
]);

export default function AppLayout() {
  const { pathname } = useLocation();
  const { favorites } = useToolFavorites();
  const [showFeatureSidebar, setShowFeatureSidebar] = useState(true);
  const hasFeatureSidebar = routesWithFeatureSidebar.has(pathname);

  const favoriteRoutes = favorites
    .slice(0, 3)
    .map((url) => tools.find((tool) => tool.url === url))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool))
    .map((tool) => ({
      label: navTitle(tool.title),
      to: tool.url,
      icon: tool.icon,
    }));

  const quickRoutes = [{ label: 'Home', to: '/', icon: Home }, ...favoriteRoutes];

  const isFullBleed =
    pathname === '/code-snippet' ||
    pathname === '/post-composer' ||
    pathname === '/document-annotator' ||
    pathname === '/palette-collection' ||
    pathname === '/palette-generator' ||
    pathname === '/tailwind-shade-generator' ||
    pathname === '/markdown-live-preview' ||
    pathname === '/placeholder-generator' ||
    pathname === '/base64-image-encoder' ||
    pathname === '/favicon-generator' ||
    pathname === '/image-converter' ||
    pathname === '/image-crop' ||
    pathname === '/image-splitter' ||
    pathname === '/image-stitcher' ||
    pathname === '/base-converter' ||
    pathname === '/unit-converter' ||
    pathname === '/pdf-toolkit' ||
    pathname === '/svg-viewer' ||
    pathname === '/json-viewer' ||
    pathname === '/csv-viewer' ||
    pathname === '/code-viewer' ||
    pathname === '/html-viewer' ||
    pathname === '/jwt-decoder' ||
    pathname === '/uuid-generator' ||
    pathname === '/password-generator' ||
    pathname === '/lorem-ipsum-generator' ||
    pathname === '/qr-code-generator' ||
    pathname === '/ascii-art-generator' ||
    pathname === '/word-counter' ||
    pathname === '/typography-calculator' ||
    pathname === '/world-scripts' ||
    pathname === '/glyph-browser' ||
    pathname === '/colour-converter' ||
    pathname === '/contrast-checker' ||
    pathname === '/gradient-generator' ||
    pathname === '/meta-tag-generator' ||
    pathname === '/border-radius-generator' ||
    pathname === '/glassmorphism-generator' ||
    pathname === '/animation-generator' ||
    pathname === '/flex-patterns';

  useEffect(() => {
    setShowFeatureSidebar(true);
  }, [pathname]);

  return (
    <SidebarProvider className={isFullBleed ? 'h-svh overflow-hidden' : undefined}>
      <AppSidebar />
      <SidebarInset className={isFullBleed ? 'min-h-0 overflow-hidden' : undefined}>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/80 bg-background/75 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
          <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <nav className="flex min-w-0 items-center gap-1 overflow-x-auto overflow-y-hidden px-2">
              {quickRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <NavLink
                    key={route.to}
                    to={route.to}
                    end={route.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
                        'shrink-0 gap-1.5 text-muted-foreground',
                        isActive && 'text-foreground'
                      )
                    }
                  >
                    <Icon className="size-3.5" />
                    {route.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 pr-4">
            {hasFeatureSidebar && (
              <Button variant="outline" size="sm" onClick={() => setShowFeatureSidebar((value) => !value)}>
                {showFeatureSidebar ? (
                  <PanelRightClose data-icon="inline-start" className="size-4" />
                ) : (
                  <PanelRightOpen data-icon="inline-start" className="size-4" />
                )}
                {showFeatureSidebar ? 'Hide Tools' : 'Show Tools'}
              </Button>
            )}
            <ModeToggle />
          </div>
        </header>
        <div
          className={cn(
            'flex flex-1 flex-col',
            isFullBleed ? 'min-h-0 overflow-hidden' : 'gap-4 p-4 pt-0',
            hasFeatureSidebar &&
              '[&_aside]:overflow-hidden [&_aside]:transition-[width,max-height,opacity,border-color] [&_aside]:duration-300 [&_aside]:ease-out motion-reduce:[&_aside]:transition-none',
            hasFeatureSidebar &&
              !showFeatureSidebar &&
              '[&_aside]:pointer-events-none [&_aside]:opacity-0 [&_aside]:max-h-0 [&_aside]:border-transparent lg:[&_aside]:max-h-none lg:[&_aside]:w-0! xl:[&_aside]:w-0!'
          )}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
