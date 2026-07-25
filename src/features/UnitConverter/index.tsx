import { CategoryTabs, UnitConverterHeader, UnitTable } from './components';

export default function UnitConverter() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <UnitConverterHeader />

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="overflow-hidden border border-border">
          <CategoryTabs />
          <UnitTable />
        </div>
      </div>
    </div>
  );
}
