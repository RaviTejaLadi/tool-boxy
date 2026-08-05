import { ChartBarIcon, FolderIcon, MagnifyingGlassIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { type SidebarPanel, useCodeViewerStore } from '../stores';

const PANELS: Array<{ id: SidebarPanel; label: string; icon: typeof FolderIcon }> = [
  { id: 'files', label: 'Files', icon: FolderIcon },
  { id: 'search', label: 'Search', icon: MagnifyingGlassIcon },
  { id: 'insights', label: 'Insights', icon: ChartBarIcon },
  { id: 'findings', label: 'Findings', icon: WarningCircleIcon },
];

export function SidebarPanelTabs() {
  const sidebarPanel = useCodeViewerStore((s) => s.sidebarPanel);
  const setSidebarPanel = useCodeViewerStore((s) => s.setSidebarPanel);

  return (
    <ToggleGroup
      value={[sidebarPanel]}
      onValueChange={(value) => {
        const next = value[0] as SidebarPanel | undefined;
        if (next) setSidebarPanel(next);
      }}
      variant="outline"
      size="sm"
      spacing={0}
      className="w-full"
    >
      {PANELS.map(({ id, label, icon: Icon }) => (
        <ToggleGroupItem
          key={id}
          value={id}
          className="flex-1 rounded-none px-1 font-mono text-[10px]"
          aria-label={label}
          title={label}
        >
          <Icon className="size-3.5" />
          <span className="hidden xl:inline">{label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
