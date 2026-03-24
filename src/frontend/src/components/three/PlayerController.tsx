import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { JoystickState, TouchActions } from "../../hooks/useTouchControls";

interface PlayerControllerProps {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  cameraMode: "first" | "third";
  flightEnabled: boolean;
  paused: boolean;
  onInteract: (text: string) => void;
  onEat: (amount?: number) => void;
  onDrink: (amount?: number) => void;
  onTakeDamage: (amount: number) => void;
  onAddWanted: (amount?: number) => void;
  isTouchDevice?: boolean;
  joystick?: JoystickState;
  touchActions?: TouchActions;
  cameraTouch?: { deltaX: number; deltaY: number };
  onResetCameraDelta?: () => void;
}

const MOVE_SPEED = 8;
const SPRINT_SPEED = 16;
const FLY_SPEED = 20;
const JUMP_FORCE = 8;
const GRAVITY = -20;

export default function PlayerController({
  playerPosRef,
  cameraMode,
  flightEnabled,
  paused,
  onInteract: _onInteract,
  isTouchDevice = false,
  joystick,
  touchActions,
  cameraTouch,
  onResetCameraDelta,
}: PlayerControllerProps) {
  const { camera } = useThree();

  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  });

  const velocityRef = useRef(new THREE.Vector3());
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const isGroundedRef = useRef(true);
  const mouseLocked = useRef(false);
  const prevJumpRef = useRef(false);

  // Keyboard listeners (desktop only)
  useEffect(() => {
    if (paused || isTouchDevice) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keysRef.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keysRef.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keysRef.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keysRef.current.right = true;
          break;
        case "Space":
          keysRef.current.jump = true;
          e.preventDefault();
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keysRef.current.sprint = true;
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keysRef.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keysRef.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keysRef.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keysRef.current.right = false;
          break;
        case "Space":
          keysRef.current.jump = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keysRef.current.sprint = false;
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [paused, isTouchDevice]);

  // Mouse look (desktop only)
  useEffect(() => {
    if (paused || isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseLocked.current) return;
      yawRef.current -= e.movementX * 0.002;
      pitchRef.current -= e.movementY * 0.002;
      pitchRef.current = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, pitchRef.current),
      );
    };

    const onPointerLockChange = () => {
      mouseLocked.current = document.pointerLockElement !== null;
    };

    const onCanvasClick = () => {
      const canvas = document.querySelector("canvas");
      if (canvas && !mouseLocked.current) {
        canvas.requestPointerLock().catch(() => {});
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.querySelector("canvas")?.addEventListener("click", onCanvasClick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document
        .querySelector("canvas")
        ?.removeEventListener("click", onCanvasClick);
    };
  }, [paused, isTouchDevice]);

  useFrame((_, delta) => {
    if (paused) return;

    // Apply touch camera delta
    if (isTouchDevice && cameraTouch) {
      if (cameraTouch.deltaX !== 0 || cameraTouch.deltaY !== 0) {
        yawRef.current -= cameraTouch.deltaX * 0.003;
        pitchRef.current -= cameraTouch.deltaY * 0.003;
        pitchRef.current = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, pitchRef.current),
        );
        onResetCameraDelta?.();
      }
    }

    // Merge touch inputs into keys
    let keys = keysRef.current;
    if (isTouchDevice && joystick && touchActions) {
      const jx = joystick.x;
      const jy = joystick.y;
      keys = {
        forward: jy < -0.2,
        backward: jy > 0.2,
        left: jx < -0.2,
        right: jx > 0.2,
        jump: touchActions.jump,
        sprint: touchActions.sprint,
      };
    }

    const pos = playerPosRef.current;
    const vel = velocityRef.current;

    const speed = flightEnabled
      ? FLY_SPEED
      : keys.sprint
        ? SPRINT_SPEED
        : MOVE_SPEED;

    const forward = new THREE.Vector3(
      -Math.sin(yawRef.current),
      0,
      -Math.cos(yawRef.current),
    );
    const right = new THREE.Vector3(
      Math.cos(yawRef.current),
      0,
      -Math.sin(yawRef.current),
    );

    const moveDir = new THREE.Vector3();
    if (keys.forward) moveDir.add(forward);
    if (keys.backward) moveDir.sub(forward);
    if (keys.right) moveDir.add(right);
    if (keys.left) moveDir.sub(right);

    if (moveDir.length() > 0) moveDir.normalize();

    vel.x = moveDir.x * speed;
    vel.z = moveDir.z * speed;

    if (flightEnabled) {
      if (keys.jump) vel.y = speed * 0.5;
      else if (keys.sprint) vel.y = -speed * 0.5;
      else vel.y *= 0.9;
    } else {
      if (!isGroundedRef.current) {
        vel.y += GRAVITY * delta;
      } else {
        vel.y = 0;
        // Edge-trigger jump (only on press, not hold)
        const jumpPressed = keys.jump;
        if (jumpPressed && !prevJumpRef.current) {
          vel.y = JUMP_FORCE;
          isGroundedRef.current = false;
        }
        prevJumpRef.current = jumpPressed;
      }
    }

    pos.x += vel.x * delta;
    pos.y += vel.y * delta;
    pos.z += vel.z * delta;

    const groundY = 2;
    if (pos.y <= groundY && !flightEnabled) {
      pos.y = groundY;
      vel.y = 0;
      isGroundedRef.current = true;
    }

    pos.x = Math.max(-490, Math.min(490, pos.x));
    pos.z = Math.max(-490, Math.min(490, pos.z));

    playerPosRef.current.copy(pos);

    if (cameraMode === "first") {
      camera.position.set(pos.x, pos.y + 0.6, pos.z);
      camera.rotation.order = "YXZ";
      camera.rotation.y = yawRef.current;
      camera.rotation.x = pitchRef.current;
    } else {
      const camDist = 8;
      const camHeight = 4;
      const camX = pos.x + Math.sin(yawRef.current) * camDist;
      const camZ = pos.z + Math.cos(yawRef.current) * camDist;
      camera.position.lerp(
        new THREE.Vector3(camX, pos.y + camHeight, camZ),
        0.1,
      );
      camera.lookAt(pos.x, pos.y + 1.5, pos.z);
    }
  });

  return (
    <group
      position={[
        playerPosRef.current.x,
        playerPosRef.current.y,
        playerPosRef.current.z,
      ]}
    >
      {cameraMode === "third" && (
        <>
          <mesh position={[0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.35, 1.2, 4, 8]} />
            <meshStandardMaterial
              color="#ff6600"
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
            <sphereGeometry args={[0.32, 8, 8]} />
            <meshStandardMaterial color="#ffcc99" roughness={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}
