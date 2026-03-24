import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type React from "react";
import { useState } from "react";
import * as THREE from "three";

const PATROL_WAYPOINTS: [number, number, number][] = [
  [-20, 0.5, -15],
  [-20, 0.5, 10],
  [-10, 0.5, 25],
  [10, 0.5, 25],
  [20, 0.5, 10],
  [20, 0.5, -15],
  [0, 0.5, -30],
  [-10, 0.5, -20],
];

interface PolicePatrolRouteProps {
  playerPosition: React.MutableRefObject<THREE.Vector3>;
  onWaypointReached?: (waypointIndex: number, total: number) => void;
}

export default function PolicePatrolRoute({
  playerPosition,
  onWaypointReached,
}: PolicePatrolRouteProps) {
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [completedWaypoints, setCompletedWaypoints] = useState<Set<number>>(
    new Set(),
  );

  useFrame(() => {
    if (!playerPosition.current) return;
    const target = new THREE.Vector3(...PATROL_WAYPOINTS[currentWaypoint]);
    const dist = playerPosition.current.distanceTo(target);
    if (dist < 3) {
      const next = (currentWaypoint + 1) % PATROL_WAYPOINTS.length;
      setCompletedWaypoints((prev) => new Set([...prev, currentWaypoint]));
      setCurrentWaypoint(next);
      onWaypointReached?.(currentWaypoint, PATROL_WAYPOINTS.length);
    }
  });

  return (
    <group>
      {PATROL_WAYPOINTS.map((wp, i) => {
        const isNext = i === currentWaypoint;
        const isDone = completedWaypoints.has(i);
        const color = isDone ? "#00ff00" : isNext ? "#ffff00" : "#4488ff";
        const emissive = isDone ? "#00aa00" : isNext ? "#aaaa00" : "#2244aa";

        return (
          <group
            // biome-ignore lint/suspicious/noArrayIndexKey: positional index is stable for static waypoints
            key={i}
            position={wp}
          >
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 12]} />
              <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={0.6}
              />
            </mesh>
            {isNext && (
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 4, 6]} />
                <meshStandardMaterial
                  color="#ffff00"
                  emissive="#aaaa00"
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}
            <Billboard position={[0, 1.5, 0]}>
              <Text
                fontSize={0.3}
                color={color}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.03}
                outlineColor="#000000"
              >
                {isDone ? "✓" : isNext ? `▶ Checkpoint ${i + 1}` : `${i + 1}`}
              </Text>
            </Billboard>
          </group>
        );
      })}

      {/* Path lines between waypoints */}
      {PATROL_WAYPOINTS.map((wp, i) => {
        const next = PATROL_WAYPOINTS[(i + 1) % PATROL_WAYPOINTS.length];
        const start = new THREE.Vector3(...wp);
        const end = new THREE.Vector3(...next);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dir = end.clone().sub(start);
        const len = dir.length();
        const angle = Math.atan2(dir.x, dir.z);

        return (
          <mesh
            // biome-ignore lint/suspicious/noArrayIndexKey: positional index is stable for static segments
            key={`line-${i}`}
            position={[mid.x, 0.15, mid.z]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.1, 0.05, len]} />
            <meshStandardMaterial color="#4488ff" transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
