import { useState } from "react";

interface GameViewProps {
  onExit: () => void;
}

export default function GameView({ onExit }: GameViewProps) {
  const [_isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000", zIndex: 50 }}
    >
      {/* Exit button */}
      <button
        type="button"
        onClick={onExit}
        data-ocid="game.close_button"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 100,
          background: "rgba(0,0,0,0.7)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 6,
          padding: "6px 14px",
          cursor: "pointer",
          fontSize: 13,
          fontFamily: "monospace",
        }}
      >
        ← EXIT
      </button>
      {/* Fullscreen toggle */}
      <button
        type="button"
        onClick={() => {
          const iframe = document.getElementById(
            "maplewood-iframe",
          ) as HTMLIFrameElement;
          if (iframe) {
            iframe.requestFullscreen?.();
            setIsFullscreen(true);
          }
        }}
        data-ocid="game.toggle"
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 100,
          background: "rgba(0,0,0,0.7)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 6,
          padding: "6px 14px",
          cursor: "pointer",
          fontSize: 13,
          fontFamily: "monospace",
        }}
      >
        ⛶ FULLSCREEN
      </button>
      <iframe
        id="maplewood-iframe"
        src="/maplewood/index.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="autoplay; fullscreen; keyboard; pointer-lock"
        title="Maplewood City"
      />
    </div>
  );
}
