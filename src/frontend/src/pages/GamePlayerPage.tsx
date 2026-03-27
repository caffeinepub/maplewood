import { Maximize2, X } from "lucide-react";
import { useRef, useState } from "react";

interface GamePlayerPageProps {
  title: string;
  src: string;
  fallbackSrc?: string;
  onBack: () => void;
}

export default function GamePlayerPage({
  title,
  src,
  fallbackSrc,
  onBack,
}: GamePlayerPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [triedFallback, setTriedFallback] = useState(false);
  const [showControls, setShowControls] = useState(true);

  function handleError() {
    if (!triedFallback && fallbackSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
    }
  }

  function handleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black"
      style={{ width: "100dvw", height: "100dvh" }}
      data-ocid="game_player.panel"
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Iframe fills full screen — no header stealing space */}
      <iframe
        ref={iframeRef}
        key={currentSrc}
        src={currentSrc}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        allow="autoplay *; fullscreen *; keyboard; microphone; camera; encrypted-media; gyroscope; accelerometer"
        title={title}
        onError={handleError}
      />

      {/* Floating overlay controls — top-right, fade when idle */}
      <div
        className="absolute top-3 right-3 flex items-center gap-2 z-50 transition-opacity duration-300"
        style={{ opacity: showControls ? 1 : 0.15 }}
        onMouseEnter={() => setShowControls(true)}
      >
        <button
          type="button"
          onClick={handleFullscreen}
          className="flex items-center gap-1 text-white text-xs font-bold bg-black/70 hover:bg-black/90 border border-white/30 hover:border-white/70 rounded-lg px-3 py-2 backdrop-blur-sm transition-all"
          data-ocid="game_player.toggle"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline">Fullscreen</span>
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-white text-xs font-bold bg-black/70 hover:bg-black/90 border border-white/30 hover:border-white/70 rounded-lg px-3 py-2 backdrop-blur-sm transition-all"
          data-ocid="game_player.close_button"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    </div>
  );
}
