import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { ModeToggle } from '@/components/theme/mode-toggle';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/layouts/AppSidebar';
import { cn } from '@/lib/utils';

const quickRoutes = [
  { label: 'Home', to: '/' },
  { label: 'Design', to: '/projects/design' },
] as const;

export default function AppLayout() {
  const { pathname } = useLocation();
  const isFullBleed =
    pathname === '/code-snippet' ||
    pathname === '/palette-collection' ||
    pathname === '/palette-generator' ||
    pathname === '/tailwind-shade-generator' ||
    pathname === '/markdown-live-preview' ||
    pathname === '/placeholder-generator' ||
    pathname === '/base64-image-encoder' ||
    pathname === '/favicon-generator' ||
    pathname === '/image-converter' ||
    pathname === '/image-splitter' ||
    pathname === '/base-converter' ||
    pathname === '/unit-converter' ||
    pathname === '/pdf-viewer' ||
    pathname === '/svg-viewer';

  return (
    <SidebarProvider className={isFullBleed ? 'h-svh overflow-hidden' : undefined}>
      <AppSidebar />
      <SidebarInset className={isFullBleed ? 'min-h-0 overflow-hidden' : undefined}>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <nav className="flex items-center gap-1 px-2">
              {quickRoutes.map((route) => (
                <NavLink
                  key={route.to}
                  to={route.to}
                  end={route.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
                      'text-muted-foreground',
                      isActive && 'text-foreground'
                    )
                  }
                >
                  {route.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="pr-4">
            <ModeToggle />
          </div>
        </header>
        <div className={cn('flex flex-1 flex-col', isFullBleed ? 'min-h-0 overflow-hidden' : 'gap-4 p-4 pt-0')}>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
