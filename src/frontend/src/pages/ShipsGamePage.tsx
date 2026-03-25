import { Maximize2 } from "lucide-react";
import { useRef, useState } from "react";

interface ShipsGamePageProps {
  onBack: () => void;
}

const PRIMARY_SRC = "https://yp3d.com/ships3d/";
const FALLBACK_SRC =
  "https://html5.gamedistribution.com/05651e622f534bd89e4a636b3a9aa8e7/";

export default function ShipsGamePage({ onBack }: ShipsGamePageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState(PRIMARY_SRC);
  const [triedFallback, setTriedFallback] = useState(false);

  function handleError() {
    if (!triedFallback) {
      setTriedFallback(true);
      setSrc(FALLBACK_SRC);
    }
  }

  function handleFullscreen() {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen().catch(() => {});
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-black/80 border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm tracking-widest uppercase">
            Ships 3D
          </span>
          <span className="text-xs text-white/40">by YP3D</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFullscreen}
            className="text-white/60 hover:text-white flex items-center gap-1 text-xs border border-white/20 hover:border-white/50 rounded px-3 py-1 transition-colors"
            title="Fullscreen"
            data-ocid="ships.toggle"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="text-white/60 hover:text-white text-xs border border-white/20 hover:border-white/50 rounded px-3 py-1 transition-colors"
            data-ocid="ships.close_button"
          >
            ← Back
          </button>
        </div>
      </div>
      <div className="flex-1">
        <iframe
          ref={iframeRef}
          key={src}
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          allow="autoplay *; fullscreen *; keyboard; microphone; camera; encrypted-media"
          title="Ships 3D"
          style={{ display: "block", border: "none" }}
          onError={handleError}
        />
      </div>
    </div>
  );
}
