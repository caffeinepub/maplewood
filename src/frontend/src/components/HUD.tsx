import {
  Droplets,
  Heart,
  type LucideIcon,
  Shield,
  Utensils,
} from "lucide-react";
import React from "react";
import { GameJob } from "../backend";
import MiniMap from "./MiniMap";
import WantedLevelIndicator from "./WantedLevelIndicator";

interface HUDProps {
  health: number;
  hunger: number;
  thirst: number;
  armor: number;
  wantedLevel: number;
  playerPos: { x: number; z: number };
  equippedItem?: string;
  job?: GameJob;
}

interface StatBarProps {
  value: number;
  max?: number;
  colorClass: string;
  icon: LucideIcon;
}

// Weapon image mapping for HUD display
const WEAPON_HUD_IMAGES: Record<string, string> = {
  Fists:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop",
  "Iron Sword":
    "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=64&h=64&fit=crop",
  Pistol:
    "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=64&h=64&fit=crop",
  "Assault Rifle":
    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=64&h=64&fit=crop",
  "Laser Blaster":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop",
  Grenade:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=64&h=64&fit=crop",
};

function StatBar({ value, max = 100, colorClass, icon: Icon }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-1 md:gap-1.5">
      <Icon
        className={`w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0 ${colorClass}`}
      />
      <div className="w-14 md:w-20 h-1.5 md:h-2 bg-muted/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            pct > 60
              ? "bg-green-500"
              : pct > 30
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] md:text-xs font-gaming text-muted-foreground w-5 md:w-6 text-right">
        {Math.round(value)}
      </span>
    </div>
  );
}

const JOB_LABELS: Record<GameJob, string> = {
  [GameJob.policeOfficer]: "POLICE OFFICER",
  [GameJob.swat]: "SWAT TEAM",
  [GameJob.firstResponder]: "FIRST RESPONDER",
  [GameJob.dealershipWorker]: "DEALERSHIP WORKER",
  [GameJob.unemployed]: "",
};

export default function HUD({
  health,
  hunger,
  thirst,
  armor,
  wantedLevel,
  playerPos,
  equippedItem,
  job,
}: HUDProps) {
  const weaponImage = equippedItem ? WEAPON_HUD_IMAGES[equippedItem] : null;

  return (
    <>
      {/* Bottom-right stats */}
      <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 z-30 pointer-events-none">
        <div className="hud-bar rounded-lg p-2 md:p-3 space-y-1 md:space-y-1.5">
          <div className="bg-background/70 rounded p-1.5 md:p-2 space-y-1 md:space-y-1.5">
            <StatBar value={health} colorClass="text-red-400" icon={Heart} />
            <StatBar value={armor} colorClass="text-blue-400" icon={Shield} />
            <StatBar
              value={hunger}
              colorClass="text-yellow-400"
              icon={Utensils}
            />
            <StatBar
              value={thirst}
              colorClass="text-cyan-400"
              icon={Droplets}
            />
          </div>
        </div>
      </div>

      {/* Top-right: wanted level */}
      <div className="fixed top-12 md:top-14 right-2 md:right-4 z-30 pointer-events-none">
        <WantedLevelIndicator level={wantedLevel} />
      </div>

      {/* Mini-map top-left */}
      <div className="fixed top-12 md:top-14 left-2 md:left-4 z-30 pointer-events-none">
        <MiniMap playerPos={playerPos} />
      </div>

      {/* Equipped item bottom-center */}
      {equippedItem && (
        <div className="fixed bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="hud-bar rounded px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-muted/60 rounded border border-neon-orange/40 overflow-hidden flex-shrink-0">
              {weaponImage ? (
                <img
                  src={weaponImage}
                  alt={equippedItem}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-muted/60" />
              )}
            </div>
            <span className="font-gaming text-[10px] md:text-xs text-neon-orange">
              {equippedItem}
            </span>
          </div>
        </div>
      )}

      {/* Job indicator top-center */}
      {job && job !== GameJob.unemployed && (
        <div className="fixed top-12 md:top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="hud-bar rounded px-2 md:px-3 py-0.5 md:py-1">
            <span className="font-gaming text-[9px] md:text-xs text-neon-yellow tracking-wider">
              {JOB_LABELS[job]}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
