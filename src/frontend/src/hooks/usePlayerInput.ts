import { useCallback, useEffect, useRef } from "react";

export interface PlayerInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  interact: boolean;
  pickup: boolean;
  toggleCamera: boolean;
  toggleFlight: boolean;
  openInventory: boolean;
  openMap: boolean;
  pause: boolean;
  chat: boolean;
  attack: boolean;
}

const DEFAULT_INPUT: PlayerInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false,
  interact: false,
  pickup: false,
  toggleCamera: false,
  toggleFlight: false,
  openInventory: false,
  openMap: false,
  pause: false,
  chat: false,
  attack: false,
};

export function usePlayerInput(enabled = true) {
  const inputRef = useRef<PlayerInput>({ ...DEFAULT_INPUT });
  const oneShotRef = useRef<Partial<PlayerInput>>({});

  const getInput = useCallback(
    () => ({ ...inputRef.current, ...oneShotRef.current }),
    [],
  );

  const clearOneShots = useCallback(() => {
    oneShotRef.current = {};
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          inputRef.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          inputRef.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          inputRef.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          inputRef.current.right = true;
          break;
        case "Space":
          inputRef.current.jump = true;
          e.preventDefault();
          break;
        case "ShiftLeft":
        case "ShiftRight":
          inputRef.current.sprint = true;
          break;
        case "KeyE":
          oneShotRef.current.interact = true;
          break;
        case "KeyF":
          oneShotRef.current.pickup = true;
          break;
        case "KeyV":
          oneShotRef.current.toggleCamera = true;
          break;
        case "KeyG":
          oneShotRef.current.toggleFlight = true;
          break;
        case "KeyI":
          oneShotRef.current.openInventory = true;
          break;
        case "KeyM":
          oneShotRef.current.openMap = true;
          break;
        case "Escape":
          oneShotRef.current.pause = true;
          break;
        case "KeyT":
          oneShotRef.current.chat = true;
          break;
        case "Mouse0":
        case "KeyQ":
          oneShotRef.current.attack = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          inputRef.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          inputRef.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          inputRef.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          inputRef.current.right = false;
          break;
        case "Space":
          inputRef.current.jump = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          inputRef.current.sprint = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled]);

  return { getInput, clearOneShots, inputRef };
}
