import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { createNPC, updateNPCState, getNextWaypoint, type NPCData, type NPCRole } from '../../utils/npcAI';

interface NPCManagerProps {
  playerPos: React.MutableRefObject<THREE.Vector3>;
  wantedLevel: number;
  violenceEnabled: boolean;
  onInteract: (text: string) => void;
}

const WORLD_BOUNDS = {
  min: new THREE.Vector3(-200, 0, -200),
  max: new THREE.Vector3(200, 0, 200),
};

const NPC_SPAWN_CONFIG: Array<{ role: NPCRole; count: number; zone: [number, number, number, number] }> = [
  { role: 'civilian', count: 20, zone: [-100, 100, -100, 100] },
  { role: 'worker', count: 10, zone: [-80, 80, -80, 80] },
  { role: 'shopOwner', count: 8, zone: [-60, 60, -60, 60] },
  { role: 'partyGoer', count: 12, zone: [-70, -40, -60, -30] },
  { role: 'police', count: 6, zone: [20, 60, -10, 30] },
  { role: 'dealer', count: 4, zone: [40, 80, -60, -20] },
];

function NPCMesh({ npc, onClick }: { npc: NPCData; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [showLabel, setShowLabel] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(npc.position, 0.05);
    if (npc.state === 'walking' || npc.state === 'patrolling') {
      groupRef.current.lookAt(npc.targetPosition);
    }
  });

  if (!npc.isAlive) return null;

  const bodyColor = npc.color;
  const isMoving = npc.state === 'walking' || npc.state === 'patrolling' || npc.state === 'fleeing';

  return (
    <group
      ref={groupRef}
      position={[npc.position.x, npc.position.y, npc.position.z]}
      onClick={onClick}
      onPointerOver={() => setShowLabel(true)}
      onPointerOut={() => setShowLabel(false)}
    >
      {/* Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshLambertMaterial color="#ffcc99" />
      </mesh>
      {/* Arms */}
      <mesh position={[0.5, 1.2, isMoving ? 0.2 : 0]} rotation={[isMoving ? 0.5 : 0, 0, 0.3]}>
        <capsuleGeometry args={[0.1, 0.6, 4, 6]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      <mesh position={[-0.5, 1.2, isMoving ? -0.2 : 0]} rotation={[isMoving ? -0.5 : 0, 0, -0.3]}>
        <capsuleGeometry args={[0.1, 0.6, 4, 6]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>

      {/* Name label */}
      {showLabel && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {npc.name} [{npc.role}]
        </Text>
      )}

      {/* State indicator */}
      {npc.state === 'fleeing' && (
        <pointLight position={[0, 3, 0]} intensity={1} color="#ff4444" distance={5} />
      )}
      {npc.state === 'dancing' && (
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#ff44aa" distance={4} />
      )}
    </group>
  );
}

export default function NPCManager({ playerPos, wantedLevel, violenceEnabled, onInteract }: NPCManagerProps) {
  const [npcs, setNpcs] = useState<NPCData[]>([]);
  const frameCount = useRef(0);

  // Initialize NPCs
  useEffect(() => {
    const initialNPCs: NPCData[] = [];
    let id = 0;
    for (const config of NPC_SPAWN_CONFIG) {
      for (let i = 0; i < config.count; i++) {
        const x = config.zone[0] + Math.random() * (config.zone[1] - config.zone[0]);
        const z = config.zone[2] + Math.random() * (config.zone[3] - config.zone[2]);
        const pos = new THREE.Vector3(x, 0, z);
        initialNPCs.push(createNPC(`npc-${id++}`, config.role, pos));
      }
    }
    setNpcs(initialNPCs);
  }, []);

  useFrame(() => {
    frameCount.current++;
    // Update NPC AI every 30 frames for performance
    if (frameCount.current % 30 !== 0) return;

    setNpcs((prev) =>
      prev.map((npc) => {
        if (!npc.isAlive) return npc;

        const newState = updateNPCState(npc, playerPos.current, wantedLevel);
        let newPos = npc.position.clone();
        let newTarget = npc.targetPosition.clone();

        // Move towards target
        const distToTarget = npc.position.distanceTo(npc.targetPosition);
        if (distToTarget < 2) {
          // Pick new waypoint
          newTarget = getNextWaypoint(npc.position, WORLD_BOUNDS);
        } else if (newState === 'walking' || newState === 'patrolling') {
          const dir = newTarget.clone().sub(npc.position).normalize();
          const speed = newState === 'patrolling' ? 0.3 : 0.15;
          newPos = npc.position.clone().add(dir.multiplyScalar(speed));
        } else if (newState === 'fleeing') {
          const awayDir = npc.position.clone().sub(playerPos.current).normalize();
          newPos = npc.position.clone().add(awayDir.multiplyScalar(0.4));
        }

        return {
          ...npc,
          state: newState,
          position: newPos,
          targetPosition: newTarget,
        };
      })
    );
  });

  const handleNPCClick = (npc: NPCData) => {
    const dialogue = npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
    onInteract(`${npc.name}: "${dialogue}"`);
  };

  return (
    <group>
      {npcs.map((npc) => (
        <NPCMesh key={npc.id} npc={npc} onClick={() => handleNPCClick(npc)} />
      ))}
    </group>
  );
}
