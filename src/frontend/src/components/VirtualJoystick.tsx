import { useCallback, useEffect, useRef } from "react";
import type { JoystickState } from "../hooks/useTouchControls";

interface VirtualJoystickProps {
  onJoystickChange: (state: JoystickState) => void;
  visible: boolean;
}

const BASE_RADIUS = 60;
const HANDLE_RADIUS = 24;

export default function VirtualJoystick({
  onJoystickChange,
  visible,
}: VirtualJoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const baseCenter = useRef({ x: 0, y: 0 });

  const updateHandle = useCallback(
    (clientX: number, clientY: number) => {
      const dx = clientX - baseCenter.current.x;
      const dy = clientY - baseCenter.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clampedDist = Math.min(dist, BASE_RADIUS - HANDLE_RADIUS);
      const angle = Math.atan2(dy, dx);
      const hx = Math.cos(angle) * clampedDist;
      const hy = Math.sin(angle) * clampedDist;

      if (handleRef.current) {
        handleRef.current.style.transform = `translate(${hx}px, ${hy}px)`;
      }

      const nx =
        dist > 5
          ? (dx / dist) * Math.min(dist / (BASE_RADIUS - HANDLE_RADIUS), 1)
          : 0;
      const ny =
        dist > 5
          ? (dy / dist) * Math.min(dist / (BASE_RADIUS - HANDLE_RADIUS), 1)
          : 0;

      onJoystickChange({ active: true, x: nx, y: ny });
    },
    [onJoystickChange],
  );

  const resetHandle = useCallback(() => {
    if (handleRef.current) {
      handleRef.current.style.transform = "translate(0px, 0px)";
    }
    onJoystickChange({ active: false, x: 0, y: 0 });
  }, [onJoystickChange]);

  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;

    const onTouchStart = (e: TouchEvent) => {
      if (touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      const rect = base.getBoundingClientRect();
      baseCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      updateHandle(touch.clientX, touch.clientY);
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          updateHandle(
            e.changedTouches[i].clientX,
            e.changedTouches[i].clientY,
          );
          e.preventDefault();
          break;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          resetHandle();
          break;
        }
      }
    };

    base.addEventListener("touchstart", onTouchStart, { passive: false });
    base.addEventListener("touchmove", onTouchMove, { passive: false });
    base.addEventListener("touchend", onTouchEnd, { passive: false });
    base.addEventListener("touchcancel", onTouchEnd, { passive: false });

    return () => {
      base.removeEventListener("touchstart", onTouchStart);
      base.removeEventListener("touchmove", onTouchMove);
      base.removeEventListener("touchend", onTouchEnd);
      base.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [updateHandle, resetHandle]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-24 left-8 z-50 select-none"
      style={{ touchAction: "none" }}
    >
      <div
        ref={baseRef}
        className="relative flex items-center justify-center rounded-full border-2 border-white/30 bg-black/40 backdrop-blur-sm"
        style={{ width: BASE_RADIUS * 2, height: BASE_RADIUS * 2 }}
      >
        {/* Crosshair lines */}
        <div className="absolute w-full h-px bg-white/10" />
        <div className="absolute w-px h-full bg-white/10" />
        {/* Handle */}
        <div
          ref={handleRef}
          className="absolute rounded-full bg-white/70 border-2 border-white shadow-lg"
          style={{
            width: HANDLE_RADIUS * 2,
            height: HANDLE_RADIUS * 2,
            transition: "none",
          }}
        />
      </div>
    </div>
  );
}
