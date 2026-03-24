import { Button } from "@/components/ui/button";
import { LogOut, Map as MapIcon, Play, Settings, User } from "lucide-react";
import { useState } from "react";
import SettingsPanel from "./SettingsPanel";

interface PauseMenuProps {
  onResume: () => void;
  onExit: () => void;
}

export default function PauseMenu({ onResume, onExit }: PauseMenuProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md">
        <div className="panel-dark rounded-xl w-72 border border-neon-orange/40 animate-slide-in overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-neon-orange/20 to-neon-red/20 p-6 text-center border-b border-border">
            <h2 className="font-gaming text-2xl text-neon-orange tracking-widest">
              PAUSED
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-gaming tracking-wider">
              MAPLEWOOD CANADA
            </p>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            <Button
              onClick={onResume}
              className="w-full btn-neon font-gaming text-sm tracking-wider justify-start gap-3"
            >
              <Play className="w-4 h-4 fill-white" /> RESUME GAME
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="w-full border-border font-gaming text-sm tracking-wider justify-start gap-3 hover:border-neon-orange/50"
            >
              <Settings className="w-4 h-4" /> SETTINGS
            </Button>
            <Button
              variant="outline"
              className="w-full border-border font-gaming text-sm tracking-wider justify-start gap-3 hover:border-neon-orange/50"
            >
              <MapIcon className="w-4 h-4" /> MAP
            </Button>
            <Button
              variant="outline"
              className="w-full border-border font-gaming text-sm tracking-wider justify-start gap-3 hover:border-neon-orange/50"
            >
              <User className="w-4 h-4" /> PROFILE
            </Button>
            <div className="pt-2 border-t border-border">
              <Button
                variant="ghost"
                onClick={onExit}
                className="w-full text-neon-red hover:text-neon-red/80 font-gaming text-sm tracking-wider justify-start gap-3"
              >
                <LogOut className="w-4 h-4" /> EXIT TO MENU
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
}
