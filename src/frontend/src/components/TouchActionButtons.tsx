import { useCallback } from "react";
import type { TouchActions } from "../hooks/useTouchControls";

interface TouchActionButtonsProps {
  visible: boolean;
  onAction: (action: keyof TouchActions, value: boolean) => void;
  onCameraToggle: () => void;
  onFlightToggle: () => void;
  onInventory: () => void;
  onPause: () => void;
}

interface ActionButtonProps {
  label: string;
  color: string;
  onPressStart: () => void;
  onPressEnd: () => void;
  size?: "sm" | "md" | "lg";
}

function ActionButton({
  label,
  color,
  onPressStart,
  onPressEnd,
  size = "md",
}: ActionButtonProps) {
  const sizeClass =
    size === "sm"
      ? "w-10 h-10 text-[10px]"
      : size === "lg"
        ? "w-16 h-16 text-xs"
        : "w-12 h-12 text-[11px]";

  return (
    <button
      type="button"
      className={`${sizeClass} rounded-full border-2 ${color} bg-black/50 backdrop-blur-sm font-bold select-none active:scale-90 transition-transform flex items-center justify-center`}
      onTouchStart={(e) => {
        e.preventDefault();
        onPressStart();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onPressEnd();
      }}
      onTouchCancel={(e) => {
        e.preventDefault();
        onPressEnd();
      }}
      style={{ touchAction: "none" }}
    >
      {label}
    </button>
  );
}

export default function TouchActionButtons({
  visible,
  onAction,
  onCameraToggle,
  onFlightToggle,
  onInventory,
  onPause,
}: TouchActionButtonsProps) {
  const _noop = useCallback(() => {}, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-8 right-4 z-50 select-none"
      style={{ touchAction: "none" }}
    >
      {/* Main action cluster */}
      <div className="relative" style={{ width: 160, height: 160 }}>
        {/* JUMP - top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <ActionButton
            label="JUMP"
            color="border-green-400 text-green-300"
            onPressStart={() => onAction("jump", true)}
            onPressEnd={() => onAction("jump", false)}
            size="md"
          />
        </div>
        {/* FIRE - right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <ActionButton
            label="FIRE"
            color="border-red-400 text-red-300"
            onPressStart={() => onAction("fire", true)}
            onPressEnd={() => onAction("fire", false)}
            size="lg"
          />
        </div>
        {/* SPRINT - left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <ActionButton
            label="RUN"
            color="border-yellow-400 text-yellow-300"
            onPressStart={() => onAction("sprint", true)}
            onPressEnd={() => onAction("sprint", false)}
            size="md"
          />
        </div>
        {/* INTERACT - bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <ActionButton
            label="USE"
            color="border-blue-400 text-blue-300"
            onPressStart={() => onAction("interact", true)}
            onPressEnd={() => onAction("interact", false)}
            size="md"
          />
        </div>
      </div>

      {/* Utility buttons row */}
      <div className="flex gap-2 mt-3 justify-end">
        <button
          type="button"
          className="w-9 h-9 rounded-lg border border-white/30 bg-black/50 backdrop-blur-sm text-white/70 text-[9px] font-bold active:scale-90 transition-transform"
          onTouchStart={(e) => {
            e.preventDefault();
            onCameraToggle();
          }}
          onTouchEnd={(e) => e.preventDefault()}
          style={{ touchAction: "none" }}
        >
          CAM
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-lg border border-white/30 bg-black/50 backdrop-blur-sm text-white/70 text-[9px] font-bold active:scale-90 transition-transform"
          onTouchStart={(e) => {
            e.preventDefault();
            onFlightToggle();
          }}
          onTouchEnd={(e) => e.preventDefault()}
          style={{ touchAction: "none" }}
        >
          FLY
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-lg border border-white/30 bg-black/50 backdrop-blur-sm text-white/70 text-[9px] font-bold active:scale-90 transition-transform"
          onTouchStart={(e) => {
            e.preventDefault();
            onInventory();
          }}
          onTouchEnd={(e) => e.preventDefault()}
          style={{ touchAction: "none" }}
        >
          INV
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-lg border border-white/30 bg-black/50 backdrop-blur-sm text-white/70 text-[9px] font-bold active:scale-90 transition-transform"
          onTouchStart={(e) => {
            e.preventDefault();
            onPause();
          }}
          onTouchEnd={(e) => e.preventDefault()}
          style={{ touchAction: "none" }}
        >
          ≡
        </button>
      </div>
    </div>
  );
}
