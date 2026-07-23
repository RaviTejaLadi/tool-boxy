import { Component, type ErrorInfo, type ReactNode } from 'react';

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

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Capture error stack trace and log to console or error tracking service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
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
        <div className="p-6 my-4 mx-auto max-w-2xl bg-red-50 rounded-xl border border-red-200 shadow-sm font-sans">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🚨</span>
            <h2 className="text-xl font-bold text-red-800">Something went wrong</h2>
          </div>

          {/* Exact error message */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-red-600 tracking-wider mb-1">Error Message</p>
            <div className="p-3 bg-red-100 rounded-lg text-sm text-red-900 font-mono font-medium overflow-x-auto">
              {this.state.error?.toString() || 'Unknown error occurred'}
            </div>
          </div>

          {/* Component stack trace */}
          {this.state.errorInfo?.componentStack && (
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase text-red-600 tracking-wider mb-1">Component Stack Trace</p>
              <pre className="p-3 bg-red-900/90 text-red-100 rounded-lg text-xs font-mono max-h-48 overflow-auto leading-relaxed">
                {this.state.errorInfo.componentStack.trim()}
              </pre>
            </div>
          )}

          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
