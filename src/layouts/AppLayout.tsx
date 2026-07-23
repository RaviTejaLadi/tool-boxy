import { NavLink, Outlet } from 'react-router-dom';

import { ModeToggle } from '@/components/mode-toggle';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/layouts/AppSidebar';
import { cn } from '@/lib/utils';

const quickRoutes = [
  { label: 'Home', to: '/' },
  { label: 'Playground', to: '/playground' },
  { label: 'Design', to: '/projects/design' },
] as const;

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          </div>
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
          <div className="pr-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
