import React from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

export default class GameErrorBoundary extends React.Component<
  { children: React.ReactNode; onExit: () => void },
  State
> {
  constructor(props: { children: React.ReactNode; onExit: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
          <p className="text-white/60 text-sm">Failed to load game.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="text-white border border-white/20 rounded px-4 py-2 text-sm hover:border-white/50"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={this.props.onExit}
              className="text-white/60 border border-white/20 rounded px-4 py-2 text-sm hover:border-white/50"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
