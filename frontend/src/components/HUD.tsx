import React from 'react';
import { Heart, Droplets, Utensils, Shield, type LucideIcon } from 'lucide-react';
import WantedLevelIndicator from './WantedLevelIndicator';
import MiniMap from './MiniMap';
import { GameJob } from '../backend';

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

function StatBar({ value, max = 100, colorClass, icon: Icon }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${colorClass}`} />
      <div className="w-20 h-2 bg-muted/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            pct > 60 ? 'bg-green-500' : pct > 30 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-gaming text-muted-foreground w-6 text-right">{Math.round(value)}</span>
    </div>
  );
}

const JOB_LABELS: Record<GameJob, string> = {
  [GameJob.policeOfficer]: 'POLICE OFFICER',
  [GameJob.swat]: 'SWAT TEAM',
  [GameJob.firstResponder]: 'FIRST RESPONDER',
  [GameJob.dealershipWorker]: 'DEALERSHIP WORKER',
  [GameJob.unemployed]: '',
};

export default function HUD({ health, hunger, thirst, armor, wantedLevel, playerPos, equippedItem, job }: HUDProps) {
  return (
    <>
      {/* Bottom-right stats */}
      <div className="fixed bottom-4 right-4 z-30 pointer-events-none">
        <div className="hud-bar rounded-lg p-3 space-y-1.5">
          <div className="bg-background/70 rounded p-2 space-y-1.5">
            <StatBar value={health} colorClass="text-red-400" icon={Heart} />
            <StatBar value={armor} colorClass="text-blue-400" icon={Shield} />
            <StatBar value={hunger} colorClass="text-yellow-400" icon={Utensils} />
            <StatBar value={thirst} colorClass="text-cyan-400" icon={Droplets} />
          </div>
        </div>
      </div>

      {/* Top-right: wanted level */}
      <div className="fixed top-14 right-4 z-30 pointer-events-none">
        <WantedLevelIndicator level={wantedLevel} />
      </div>

      {/* Mini-map top-left */}
      <div className="fixed top-14 left-4 z-30 pointer-events-none">
        <MiniMap playerPos={playerPos} />
      </div>

      {/* Equipped item bottom-center */}
      {equippedItem && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="hud-bar rounded px-4 py-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-muted/60 rounded border border-neon-orange/40 flex items-center justify-center">
              <span className="text-xs">🔫</span>
            </div>
            <span className="font-gaming text-xs text-neon-orange">{equippedItem}</span>
          </div>
        </div>
      )}

      {/* Job indicator top-center */}
      {job && job !== GameJob.unemployed && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="hud-bar rounded px-3 py-1">
            <span className="font-gaming text-xs text-neon-yellow tracking-wider">
              {JOB_LABELS[job]}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
