import { useLocation } from 'react-router-dom';

export default function SamplePage() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-2xl font-medium tracking-tight">Sample</h1>
      <p className="text-sm text-muted-foreground">
        Route: <code className="font-mono text-foreground">{pathname}</code>
      </p>
    </div>
  );
}
