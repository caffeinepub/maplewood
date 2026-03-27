import { Maximize2, X } from "lucide-react";
import { useRef, useState } from "react";

interface ShipsGamePageProps {
  onBack: () => void;
}

const PRIMARY_SRC = "https://yp3d.com/ships3d/";
const FALLBACK_SRC =
  "https://html5.gamedistribution.com/05651e622f534bd89e4a636b3a9aa8e7/";

export default function ShipsGamePage({ onBack }: ShipsGamePageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(PRIMARY_SRC);
  const [triedFallback, setTriedFallback] = useState(false);
  const [showControls, setShowControls] = useState(true);

  function handleError() {
    if (!triedFallback) {
      setTriedFallback(true);
      setSrc(FALLBACK_SRC);
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
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Iframe fills 100% of container */}
      <iframe
        ref={iframeRef}
        key={src}
        src={src}
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
        allow="autoplay *; fullscreen *; keyboard; microphone; camera; encrypted-media"
        title="Ships 3D"
        onError={handleError}
      />

      {/* Floating overlay controls — top-right corner */}
      <div
        className="absolute top-3 right-3 flex items-center gap-2 z-50 transition-opacity duration-300"
        style={{ opacity: showControls ? 1 : 0.15 }}
        onMouseEnter={() => setShowControls(true)}
      >
        <button
          type="button"
          onClick={handleFullscreen}
          className="flex items-center gap-1 text-white text-xs font-bold bg-black/70 hover:bg-black/90 border border-white/30 hover:border-white/70 rounded-lg px-3 py-2 backdrop-blur-sm transition-all"
          title="Toggle Fullscreen"
          data-ocid="ships.toggle"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline">Fullscreen</span>
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-white text-xs font-bold bg-black/70 hover:bg-black/90 border border-white/30 hover:border-white/70 rounded-lg px-3 py-2 backdrop-blur-sm transition-all"
          data-ocid="ships.close_button"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    </div>
  );
}
