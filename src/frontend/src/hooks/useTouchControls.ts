import { useCallback, useEffect, useRef, useState } from "react";

export interface JoystickState {
  active: boolean;
  x: number; // -1 to 1
  y: number; // -1 to 1
}

export interface TouchActions {
  jump: boolean;
  sprint: boolean;
  interact: boolean;
  fire: boolean;
}

export interface TouchControlsReturn {
  isTouchDevice: boolean;
  joystick: JoystickState;
  actions: TouchActions;
  cameraTouch: { deltaX: number; deltaY: number };
  setJoystick: (state: JoystickState) => void;
  setAction: (action: keyof TouchActions, value: boolean) => void;
  resetCameraDelta: () => void;
}

export function useTouchControls(): TouchControlsReturn {
  const [isTouchDevice] = useState(() => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  });

  const [joystick, setJoystick] = useState<JoystickState>({
    active: false,
    x: 0,
    y: 0,
  });
  const [actions, setActions] = useState<TouchActions>({
    jump: false,
    sprint: false,
    interact: false,
    fire: false,
  });

  const cameraDeltaRef = useRef({ deltaX: 0, deltaY: 0 });
  const [cameraDelta, setCameraDelta] = useState({ deltaX: 0, deltaY: 0 });

  // Track camera touch (right side of screen)
  const cameraTouchRef = useRef<{
    id: number;
    lastX: number;
    lastY: number;
  } | null>(null);

  useEffect(() => {
    if (!isTouchDevice) return;

    const handleTouchStart = (e: TouchEvent) => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        // Right half of screen = camera control (but not over UI buttons)
        if (touch.clientX > midX && touch.clientY < rect.bottom - 200) {
          if (!cameraTouchRef.current) {
            cameraTouchRef.current = {
              id: touch.identifier,
              lastX: touch.clientX,
              lastY: touch.clientY,
            };
          }
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const current = cameraTouchRef.current;
      if (!current) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === current.id) {
          const dx = touch.clientX - current.lastX;
          const dy = touch.clientY - current.lastY;
          cameraDeltaRef.current.deltaX += dx;
          cameraDeltaRef.current.deltaY += dy;
          setCameraDelta({
            deltaX: cameraDeltaRef.current.deltaX,
            deltaY: cameraDeltaRef.current.deltaY,
          });
          current.lastX = touch.clientX;
          current.lastY = touch.clientY;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const current = cameraTouchRef.current;
      if (!current) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === current.id) {
          cameraTouchRef.current = null;
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isTouchDevice]);

  const setAction = useCallback(
    (action: keyof TouchActions, value: boolean) => {
      setActions((prev) => ({ ...prev, [action]: value }));
    },
    [],
  );

  const resetCameraDelta = useCallback(() => {
    cameraDeltaRef.current = { deltaX: 0, deltaY: 0 };
    setCameraDelta({ deltaX: 0, deltaY: 0 });
  }, []);

  return {
    isTouchDevice,
    joystick,
    actions,
    cameraTouch: cameraDelta,
    setJoystick,
    setAction,
    resetCameraDelta,
  };
}
