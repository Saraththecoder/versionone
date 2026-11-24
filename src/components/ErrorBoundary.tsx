'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    // Here we could also log to Sentry or another error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-500 max-w-md mb-6">
            We encountered an unexpected error. Our technical team has been notified. Please try
            refreshing the page or contact support if the issue persists.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()} className="bg-slate-900 text-white">
              Refresh Page
            </Button>
            <Button onClick={() => (window.location.href = '/')} variant="outline">
              Go to Homepage
            </Button>
          </div>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mt-8 p-4 bg-slate-100 rounded text-left overflow-auto max-w-full">
              <p className="font-mono text-sm text-red-600 font-bold">
                {this.state.error.toString()}
              </p>
              <pre className="font-mono text-xs text-slate-600 mt-2">{this.state.error.stack}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
