import { Maximize2 } from "lucide-react";
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [triedFallback, setTriedFallback] = useState(false);

  function handleError() {
    if (!triedFallback && fallbackSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
    }
  }

  function handleFullscreen() {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen().catch(() => {});
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col"
      data-ocid="game_player.panel"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-black/80 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-white/60 hover:text-white text-xs border border-white/20 hover:border-white/50 rounded px-3 py-1 transition-colors"
            data-ocid="game_player.close_button"
          >
            ← Back
          </button>
          <span className="font-bold text-white text-sm tracking-widest uppercase">
            {title}
          </span>
        </div>
        <button
          type="button"
          onClick={handleFullscreen}
          className="text-white/60 hover:text-white flex items-center gap-2 text-xs border border-white/20 hover:border-white/50 rounded px-3 py-1 transition-colors"
          data-ocid="game_player.toggle"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline">Fullscreen</span>
        </button>
      </div>
      <div className="flex-1">
        <iframe
          ref={iframeRef}
          key={currentSrc}
          src={currentSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          allow="autoplay; fullscreen; keyboard"
          title={title}
          style={{ display: "block", border: "none" }}
          onError={handleError}
        />
      </div>
    </div>
  );
}
