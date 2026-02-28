import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerControllerProps {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  cameraMode: 'first' | 'third';
  flightEnabled: boolean;
  paused: boolean;
  onInteract: (text: string) => void;
  onEat: (amount?: number) => void;
  onDrink: (amount?: number) => void;
  onTakeDamage: (amount: number) => void;
  onAddWanted: (amount?: number) => void;
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
  onInteract,
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

  // Keyboard listeners
  useEffect(() => {
    if (paused) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keysRef.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': keysRef.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': keysRef.current.left = true; break;
        case 'KeyD': case 'ArrowRight': keysRef.current.right = true; break;
        case 'Space': keysRef.current.jump = true; e.preventDefault(); break;
        case 'ShiftLeft': case 'ShiftRight': keysRef.current.sprint = true; break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keysRef.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': keysRef.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': keysRef.current.left = false; break;
        case 'KeyD': case 'ArrowRight': keysRef.current.right = false; break;
        case 'Space': keysRef.current.jump = false; break;
        case 'ShiftLeft': case 'ShiftRight': keysRef.current.sprint = false; break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [paused]);

  // Mouse look
  useEffect(() => {
    if (paused) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseLocked.current) return;
      yawRef.current -= e.movementX * 0.002;
      pitchRef.current -= e.movementY * 0.002;
      pitchRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitchRef.current));
    };

    const onPointerLockChange = () => {
      mouseLocked.current = document.pointerLockElement !== null;
    };

    const onCanvasClick = () => {
      const canvas = document.querySelector('canvas');
      if (canvas && !mouseLocked.current) {
        canvas.requestPointerLock().catch(() => {});
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.querySelector('canvas')?.addEventListener('click', onCanvasClick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.querySelector('canvas')?.removeEventListener('click', onCanvasClick);
    };
  }, [paused]);

  useFrame((_, delta) => {
    if (paused) return;

    const keys = keysRef.current;
    const pos = playerPosRef.current;
    const vel = velocityRef.current;

    const speed = flightEnabled ? FLY_SPEED : keys.sprint ? SPRINT_SPEED : MOVE_SPEED;

    // Calculate movement direction based on yaw
    const forward = new THREE.Vector3(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current));
    const right = new THREE.Vector3(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current));

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
      // Gravity
      if (!isGroundedRef.current) {
        vel.y += GRAVITY * delta;
      } else {
        vel.y = 0;
        if (keys.jump) {
          vel.y = JUMP_FORCE;
          isGroundedRef.current = false;
        }
      }
    }

    // Update position
    pos.x += vel.x * delta;
    pos.y += vel.y * delta;
    pos.z += vel.z * delta;

    // Ground collision
    const groundY = 2;
    if (pos.y <= groundY && !flightEnabled) {
      pos.y = groundY;
      vel.y = 0;
      isGroundedRef.current = true;
    }

    // World bounds
    pos.x = Math.max(-490, Math.min(490, pos.x));
    pos.z = Math.max(-490, Math.min(490, pos.z));

    // Update playerPosRef
    playerPosRef.current.copy(pos);

    // Camera positioning
    if (cameraMode === 'first') {
      camera.position.set(pos.x, pos.y + 0.6, pos.z);
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yawRef.current;
      camera.rotation.x = pitchRef.current;
    } else {
      // Third person: camera behind and above player
      const camDist = 8;
      const camHeight = 4;
      const camX = pos.x + Math.sin(yawRef.current) * camDist;
      const camZ = pos.z + Math.cos(yawRef.current) * camDist;
      camera.position.lerp(new THREE.Vector3(camX, pos.y + camHeight, camZ), 0.1);
      camera.lookAt(pos.x, pos.y + 1.5, pos.z);
    }
  });

  // Player mesh (visible in third person)
  return (
    <group position={[playerPosRef.current.x, playerPosRef.current.y, playerPosRef.current.z]}>
      {cameraMode === 'third' && (
        <>
          {/* Player body */}
          <mesh position={[0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.35, 1.2, 4, 8]} />
            <meshLambertMaterial color="#ff6600" />
          </mesh>
          {/* Player head */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <sphereGeometry args={[0.32, 8, 8]} />
            <meshLambertMaterial color="#ffcc99" />
          </mesh>
        </>
      )}
    </group>
  );
}
