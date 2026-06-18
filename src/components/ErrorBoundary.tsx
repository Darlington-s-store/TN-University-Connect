import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, we would log this to our centralized logging server
    console.error("[FRONTEND UNHANDLED ERROR]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center bg-slate-950 px-4 text-white selection:bg-emerald-500/30">
          {/* Decorative gradients */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />

          <div className="text-center max-w-lg p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Top decorative bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-amber-500 rounded-full mb-8" />

            {/* Warning Icon with pulse */}
            <div className="relative h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full grid place-items-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-emerald-400 animate-pulse" />
              <div className="absolute -inset-1 bg-emerald-500/10 rounded-full blur -z-10 animate-ping duration-1000" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Something went wrong
            </h1>

            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              An unexpected application error occurred. We have logged the error details and are
              looking into it. Please try reloading the page.
            </p>

            {/* Error Message Details (collapsible or shown in small print) */}
            {this.state.error && (
              <div className="mt-6 p-4 rounded-lg bg-slate-900/50 border border-white/5 text-left font-mono text-xs text-rose-300/80 overflow-auto max-h-32">
                <strong>Error:</strong> {this.state.error.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleReload}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-emerald-600/20"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Reload Page
              </Button>
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 transition-all duration-200"
              >
                <Home className="mr-2 h-4 w-4" /> Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
