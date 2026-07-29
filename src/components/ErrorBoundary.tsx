import { Component, type ErrorInfo, type ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { cn } from '@/lib/utils';

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (isRouteErrorResponse(error)) {
    const detail =
      typeof error.data === 'string' ? error.data : error.data != null ? JSON.stringify(error.data) : error.statusText;
    return new Error(detail || `${error.status} ${error.statusText}`);
  }

  return new Error(String(error));
}

type ErrorPresentation = {
  title: string;
  description: string;
  detail: string;
};

function getErrorPresentation(error: unknown): ErrorPresentation {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: 'Page not found',
        description: "We couldn't find a tool at this address. Check the URL or choose a tool from home.",
        detail: typeof error.data === 'string' ? error.data : 'The requested path is not registered in this app.',
      };
    }

    const detail =
      typeof error.data === 'string' ? error.data : error.data != null ? JSON.stringify(error.data) : error.statusText;

    return {
      title: 'Something went wrong',
      description: `The server returned ${error.status} ${error.statusText}.`,
      detail,
    };
  }

  const normalized = normalizeError(error);

  return {
    title: 'Something went wrong',
    description: 'An unexpected error occurred while loading this page.',
    detail: normalized.message,
  };
}

type ErrorFallbackProps = {
  error: Error;
  errorInfo?: ErrorInfo | null;
  title?: string;
  description?: string;
  detail?: string;
  onReset?: () => void;
  className?: string;
};

export function ErrorFallback({
  error,
  errorInfo,
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading this page.',
  detail,
  onReset,
  className,
}: ErrorFallbackProps) {
  const message = detail ?? error.message ?? 'Unknown error occurred';

  return (
    <Empty className={cn('relative mx-auto w-full max-w-md px-0', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert className="text-destructive" aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      <Card className="w-full text-left ring-foreground/10">
        <CardHeader className="border-b pb-(--card-spacing)">
          <CardTitle className="text-xs font-normal text-muted-foreground">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-xs leading-relaxed text-foreground/90 wrap-break-word">{message}</p>
          {errorInfo?.componentStack ? (
            <pre className="mt-3 max-h-40 overflow-auto border-t border-border pt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {errorInfo.componentStack.trim()}
            </pre>
          ) : null}
        </CardContent>
        {onReset ? (
          <CardFooter className="gap-2 border-t">
            <Button type="button" size="sm" onClick={onReset}>
              Try again
            </Button>
            <Link to="/" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Go home
            </Link>
          </CardFooter>
        ) : null}
      </Card>
    </Empty>
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

      const error = this.state.error ?? new Error('Unknown error occurred');

      return (
        <ErrorFallback
          className="my-4 min-h-[min(20rem,45vh)] flex-1"
          error={error}
          errorInfo={this.state.errorInfo}
          description="This tool hit an error. You can retry or switch to another page from the sidebar."
          detail={error.message}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorPageBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,oklch(0.88_0.06_230_/0.55),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.35_0.06_240_/0.45),transparent_70%)]"
    />
  );
}

export function RouteErrorBoundary() {
  const routeError = useRouteError();
  const navigate = useNavigate();
  const presentation = getErrorPresentation(routeError);
  const error = normalizeError(routeError);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <ErrorPageBackdrop />
      <ErrorFallback
        className="relative z-10"
        error={error}
        title={presentation.title}
        description={presentation.description}
        detail={presentation.detail}
        onReset={() => navigate(0)}
      />
    </div>
  );
}
