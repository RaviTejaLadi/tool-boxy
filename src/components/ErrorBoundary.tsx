import { Component, type ErrorInfo, type ReactNode } from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (isRouteErrorResponse(error)) {
    const detail = typeof error.data === 'string' ? error.data : error.data != null ? JSON.stringify(error.data) : '';
    const message = detail ? `${error.status} ${error.statusText}: ${detail}` : `${error.status} ${error.statusText}`;
    return new Error(message);
  }

  return new Error(String(error));
}

type ErrorFallbackProps = {
  error: Error;
  errorInfo?: ErrorInfo | null;
  onReset?: () => void;
  className?: string;
};

export function ErrorFallback({ error, errorInfo, onReset, className }: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-foreground shadow-sm',
        className
      )}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>
          🚨
        </span>
        <h2 className="text-xl font-bold text-destructive">Something went wrong</h2>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Error message</p>
        <div className="overflow-x-auto rounded-lg border border-destructive/30 bg-background/80 p-3 font-mono text-sm">
          {error.message || 'Unknown error occurred'}
        </div>
      </div>

      {errorInfo?.componentStack ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Component stack</p>
          <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-xs leading-relaxed text-muted-foreground">
            {errorInfo.componentStack.trim()}
          </pre>
        </div>
      ) : null}

      {onReset ? (
        <Button type="button" variant="destructive" size="sm" className="w-fit" onClick={onReset}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      error: normalizeError(error),
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error: normalizeError(error),
      errorInfo,
    });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          className="my-4 min-h-[min(24rem,50vh)] flex-1 justify-center"
          error={this.state.error ?? new Error('Unknown error occurred')}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export function RouteErrorBoundary() {
  const routeError = useRouteError();
  const navigate = useNavigate();
  const error = normalizeError(routeError);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <ErrorFallback error={error} onReset={() => navigate(0)} />
    </div>
  );
}
