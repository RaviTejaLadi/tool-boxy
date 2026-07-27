import { useEffect } from 'react';
import { PreviewPane, UUIDGeneratorHeader, UUIDGeneratorSidebar } from './components';
import { useUuidStore } from './stores';

export default function UUIDGenerator() {
  const generateBoth = useUuidStore((s) => s.generateBoth);

  useEffect(() => {
    generateBoth();
  }, [generateBoth]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <UUIDGeneratorHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <UUIDGeneratorSidebar />
      </div>
    </div>
  );
}
