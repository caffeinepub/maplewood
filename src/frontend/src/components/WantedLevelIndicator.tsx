import { Star } from "lucide-react";

interface WantedLevelIndicatorProps {
  level: number;
}

export default function WantedLevelIndicator({
  level,
}: WantedLevelIndicatorProps) {
  if (level === 0) return null;

  return (
    <div className="hud-bar rounded px-3 py-2 flex items-center gap-1">
      <span className="font-gaming text-xs text-muted-foreground mr-1">
        WANTED
      </span>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey: static fixed-length array
          key={i}
          className={`w-4 h-4 transition-all duration-300 ${
            i < level
              ? "text-neon-yellow fill-neon-yellow drop-shadow-[0_0_4px_oklch(0.85_0.18_85)]"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}
