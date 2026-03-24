import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  type NPCData,
  type NPCRole,
  createNPC,
  getNextWaypoint,
  updateNPCState,
} from "../../utils/npcAI";

interface NPCManagerProps {
  playerPos: React.MutableRefObject<THREE.Vector3>;
  wantedLevel: number;
  violenceEnabled: boolean;
  onInteract: (text: string) => void;
  // Career-specific optional props
  playerJob?: string;
  onArrestNPC?: () => void;
  onHealNPC?: () => void;
}

const WORLD_BOUNDS = {
  min: new THREE.Vector3(-200, 0, -200),
  max: new THREE.Vector3(200, 0, 200),
};

const NPC_SPAWN_CONFIG: Array<{
  role: NPCRole;
  count: number;
  zone: [number, number, number, number];
}> = [
  { role: "civilian", count: 20, zone: [-100, 100, -100, 100] },
  { role: "worker", count: 10, zone: [-80, 80, -80, 80] },
  { role: "shopOwner", count: 8, zone: [-60, 60, -60, 60] },
  { role: "partyGoer", count: 12, zone: [-70, -40, -60, -30] },
  { role: "police", count: 6, zone: [20, 60, -10, 30] },
  { role: "dealer", count: 4, zone: [40, 80, -60, -20] },
];

// Photorealistic NPC textures from Unsplash (portrait photos)
const NPC_TEXTURES: Record<NPCRole, string[]> = {
  civilian: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=256&fit=crop&crop=face",
  ],
  worker: [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=256&fit=crop&crop=face",
  ],
  shopOwner: [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=256&fit=crop&crop=face",
  ],
  partyGoer: [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=128&h=256&fit=crop&crop=face",
  ],
  police: [
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&h=256&fit=crop&crop=face",
  ],
  swat: [
    "/assets/generated/swat-character.dim_256x512.png",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=128&h=256&fit=crop&crop=face",
  ],
  dealer: [
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=256&fit=crop&crop=face",
  ],
  criminal: [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=256&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=256&fit=crop&crop=face",
  ],
};

// Blood particle system
interface BloodParticle {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

function BloodEffect({
  position,
  active,
}: { position: THREE.Vector3; active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleData = useRef<BloodParticle[]>([]);
  const initialized = useRef(false);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 30;
    const positions = new Float32Array(count * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: 0xcc0000,
      size: 0.15,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
  }, []);

  useEffect(() => {
    if (!active || initialized.current) return;
    initialized.current = true;
    particleData.current = Array.from({ length: 30 }, (_, i) => ({
      id: `bp-${i}`,
      position: position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 5 + 2,
        (Math.random() - 0.5) * 4,
      ),
      life: 1.0,
      maxLife: 0.8 + Math.random() * 0.4,
    }));
  }, [active, position]);

  useFrame((_, delta) => {
    if (!active || !particlesRef.current) return;
    const posAttr = particlesRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    particleData.current.forEach((p, i) => {
      if (p.life <= 0) return;
      p.life -= delta / p.maxLife;
      p.velocity.y -= 9.8 * delta;
      p.position.addScaledVector(p.velocity, delta);
      posAttr.setXYZ(
        i,
        p.position.x,
        Math.max(p.position.y, 0.05),
        p.position.z,
      );
    });
    posAttr.needsUpdate = true;
    (particlesRef.current.material as THREE.PointsMaterial).opacity =
      Math.max(0, particleData.current[0]?.life ?? 0) * 0.9;
  });

  if (!active) return null;

  return <points ref={particlesRef} geometry={geometry} material={material} />;
}

function BloodPool({
  position,
  visible,
}: { position: THREE.Vector3; visible: boolean }) {
  if (!visible) return null;
  return (
    <mesh
      position={[position.x, 0.05, position.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[0.8 + Math.random() * 0.4, 12]} />
      <meshStandardMaterial
        color={0x8b0000}
        transparent
        opacity={0.85}
        roughness={0.9}
      />
    </mesh>
  );
}

function useNPCTexture(role: NPCRole, index: number) {
  const textures = NPC_TEXTURES[role] ?? NPC_TEXTURES.civilian;
  const url = textures[index % textures.length];
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [url]);
  return texture;
}

function NPCMesh({
  npc,
  onClick,
  violenceEnabled,
  npcIndex,
  isArrestable,
  isHealable,
  onArrest,
  onHeal,
}: {
  npc: NPCData;
  onClick: () => void;
  violenceEnabled: boolean;
  npcIndex: number;
  isArrestable?: boolean;
  isHealable?: boolean;
  onArrest?: () => void;
  onHeal?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [showLabel, setShowLabel] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [showBlood, setShowBlood] = useState(false);
  const [isArrested, setIsArrested] = useState(false);

  const texture = useNPCTexture(npc.role, npcIndex);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(npc.position, 0.05);
  });

  useEffect(() => {
    if (!npc.isAlive && !isDead) {
      setIsDead(true);
      if (violenceEnabled) {
        setShowBlood(true);
      }
    }
  }, [npc.isAlive, isDead, violenceEnabled]);

  // E key interaction for arrest/heal
  useEffect(() => {
    if (!showLabel) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== "KeyE") return;
      if (isArrestable && !isArrested) {
        setIsArrested(true);
        onArrest?.();
      } else if (isHealable) {
        onHeal?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showLabel, isArrestable, isHealable, isArrested, onArrest, onHeal]);

  if (!npc.isAlive && !showBlood) return null;
  if (isArrested) return null;

  const isMoving =
    npc.state === "walking" ||
    npc.state === "patrolling" ||
    npc.state === "fleeing";

  return (
    <>
      {violenceEnabled && showBlood && (
        <>
          <BloodEffect position={npc.position} active={showBlood} />
          <BloodPool position={npc.position} visible={isDead} />
        </>
      )}

      {npc.isAlive && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: R3F 3D group does not support keyboard events
        <group
          ref={groupRef}
          position={[npc.position.x, npc.position.y, npc.position.z]}
          onClick={onClick}
          onPointerOver={() => setShowLabel(true)}
          onPointerOut={() => setShowLabel(false)}
        >
          <Billboard follow lockX={false} lockY={false} lockZ={false}>
            <mesh castShadow>
              <planeGeometry args={[1.2, 2.4]} />
              <meshStandardMaterial
                map={texture}
                transparent
                alphaTest={0.1}
                roughness={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Billboard>

          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 8]} />
            <meshBasicMaterial color={0x000000} transparent opacity={0.3} />
          </mesh>

          {showLabel && (
            <Text
              position={[0, 2.8, 0]}
              fontSize={0.4}
              color="#ffffff"
              anchorX="center"
              anchorY="bottom"
              outlineWidth={0.04}
              outlineColor="#000000"
            >
              {npc.name} [{npc.role}]{isArrestable ? " [E] Arrest" : ""}
              {isHealable ? " [E] Heal" : ""}
            </Text>
          )}

          {npc.state === "fleeing" && (
            <pointLight
              position={[0, 3, 0]}
              intensity={1}
              color="#ff4444"
              distance={5}
            />
          )}
          {npc.state === "dancing" && (
            <pointLight
              position={[0, 3, 0]}
              intensity={0.5}
              color="#ff44aa"
              distance={4}
            />
          )}

          {isMoving && (
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.05, 4, 4]} />
              <meshBasicMaterial color={0x00ff00} transparent opacity={0} />
            </mesh>
          )}
        </group>
      )}
    </>
  );
}

export default function NPCManager({
  playerPos,
  wantedLevel,
  violenceEnabled,
  onInteract,
  playerJob = "unemployed",
  onArrestNPC,
  onHealNPC,
}: NPCManagerProps) {
  const [npcs, setNpcs] = useState<NPCData[]>([]);
  const frameCount = useRef(0);

  useEffect(() => {
    const initialNPCs: NPCData[] = [];
    let id = 0;
    for (const config of NPC_SPAWN_CONFIG) {
      for (let i = 0; i < config.count; i++) {
        const x =
          config.zone[0] + Math.random() * (config.zone[1] - config.zone[0]);
        const z =
          config.zone[2] + Math.random() * (config.zone[3] - config.zone[2]);
        const pos = new THREE.Vector3(x, 0, z);
        initialNPCs.push(createNPC(`npc-${id++}`, config.role, pos));
      }
    }
    setNpcs(initialNPCs);
  }, []);

  // Spawn SWAT reinforcements at high wanted levels
  useEffect(() => {
    if (wantedLevel >= 4) {
      const swatCount = wantedLevel >= 5 ? 4 : 2;
      setNpcs((prev) => {
        const existingSwat = prev.filter((n) => n.role === "swat").length;
        if (existingSwat >= swatCount) return prev;
        const newSwat: NPCData[] = [];
        for (let i = existingSwat; i < swatCount; i++) {
          const angle = (i / swatCount) * Math.PI * 2;
          const spawnPos = new THREE.Vector3(
            playerPos.current.x + Math.cos(angle) * 20,
            0,
            playerPos.current.z + Math.sin(angle) * 20,
          );
          newSwat.push(
            createNPC(`swat-reinforce-${Date.now()}-${i}`, "swat", spawnPos),
          );
        }
        return [...prev, ...newSwat];
      });
    }
  }, [wantedLevel, playerPos]);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 30 !== 0) return;

    setNpcs((prev) =>
      prev.map((npc) => {
        if (!npc.isAlive) return npc;

        const newState = updateNPCState(npc, playerPos.current, wantedLevel);
        let newPos = npc.position.clone();
        let newTarget = npc.targetPosition.clone();

        const distToTarget = npc.position.distanceTo(npc.targetPosition);
        if (distToTarget < 2) {
          newTarget = getNextWaypoint(npc.position, WORLD_BOUNDS);
        } else if (newState === "walking" || newState === "patrolling") {
          const dir = newTarget.clone().sub(npc.position).normalize();
          const speed = newState === "patrolling" ? 0.3 : 0.15;
          newPos = npc.position.clone().add(dir.multiplyScalar(speed));
        } else if (newState === "fleeing") {
          const awayDir = npc.position
            .clone()
            .sub(playerPos.current)
            .normalize();
          newPos = npc.position.clone().add(awayDir.multiplyScalar(0.4));
        } else if (npc.role === "swat" && wantedLevel >= 4) {
          // SWAT pursues player
          const toPlayer = playerPos.current
            .clone()
            .sub(npc.position)
            .normalize();
          newPos = npc.position.clone().add(toPlayer.multiplyScalar(0.5));
        }

        return {
          ...npc,
          state: newState,
          position: newPos,
          targetPosition: newTarget,
        };
      }),
    );
  });

  const handleNPCClick = (npc: NPCData) => {
    const dialogue =
      npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
    onInteract(`${npc.name}: "${dialogue}"`);
  };

  const isPoliceJob = playerJob === "policeOfficer" || playerJob === "swat";
  const isParamedicJob = playerJob === "firstResponder";

  return (
    <group>
      {npcs.map((npc, i) => {
        const distToPlayer = npc.position.distanceTo(playerPos.current);
        const isNearby = distToPlayer < 3;
        const isArrestable =
          isPoliceJob &&
          isNearby &&
          npc.role !== "police" &&
          npc.role !== "swat";
        const isHealable = isParamedicJob && isNearby;

        return (
          <NPCMesh
            key={npc.id}
            npc={npc}
            onClick={() => handleNPCClick(npc)}
            violenceEnabled={violenceEnabled}
            npcIndex={i}
            isArrestable={isArrestable}
            isHealable={isHealable}
            onArrest={() => {
              onInteract(`Arrested ${npc.name}!`);
              onArrestNPC?.();
            }}
            onHeal={() => {
              onInteract(`Healed ${npc.name}!`);
              onHealNPC?.();
            }}
          />
        );
      })}
    </group>
  );
}
