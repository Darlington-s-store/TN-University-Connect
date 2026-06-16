import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[REACT ERROR BOUNDARY]:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-elegant border border-slate-100 p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-ghana-red/10 rounded-full flex items-center justify-center mx-auto text-ghana-red">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-secondary tracking-tight">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected error occurred in the application. We have logged the details. You can
                reload the page to restore service.
              </p>
            </div>
            {this.state.error && (
              <div className="p-4 bg-[#f8fafc] rounded-2xl border text-left font-mono text-[10px] text-muted-foreground overflow-auto max-h-40 break-all">
                {this.state.error.toString()}
              </div>
            )}
            <Button onClick={this.handleReload} size="lg" className="w-full gap-2 rounded-xl">
              <RefreshCcw className="h-4 w-4" /> Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
