import { Billboard, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import type {
  BuildingInteriorLayout,
  FurnitureItem,
  InteractiveObject,
  NPCSpawn,
} from "../../utils/buildingInteriors";

interface BuildingInteriorManagerProps {
  layout: BuildingInteriorLayout;
  onExit: () => void;
  playerPosition: React.MutableRefObject<THREE.Vector3>;
  onPickupItem?: (itemId: string, itemType: string, label: string) => void;
  onInteractNPC?: (npcId: string, npcName: string) => void;
}

function FurnitureMesh({ item }: { item: FurnitureItem }) {
  const color = item.color ?? "#8b7355";
  const pos = item.position;
  const rot = item.rotation ?? [0, 0, 0];

  const renderFurniture = () => {
    switch (item.type) {
      case "desk":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[1.6, 0.08, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.7, 0, -0.3]} castShadow>
              <boxGeometry args={[0.08, 0.7, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.7, 0, -0.3]} castShadow>
              <boxGeometry args={[0.08, 0.7, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.7, 0, 0.3]} castShadow>
              <boxGeometry args={[0.08, 0.7, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.7, 0, 0.3]} castShadow>
              <boxGeometry args={[0.08, 0.7, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case "chair":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.5, 0.06, 0.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.55, -0.22]} castShadow>
              <boxGeometry args={[0.5, 0.6, 0.06]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.2, 0.1, -0.2]} castShadow>
              <boxGeometry args={[0.05, 0.22, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.2, 0.1, -0.2]} castShadow>
              <boxGeometry args={[0.05, 0.22, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.2, 0.1, 0.2]} castShadow>
              <boxGeometry args={[0.05, 0.22, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.2, 0.1, 0.2]} castShadow>
              <boxGeometry args={[0.05, 0.22, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case "bed":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[1.8, 0.4, 2.2]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[1.8, 0.2, 2.2]} />
              <meshStandardMaterial color="#f0f0f0" />
            </mesh>
            <mesh position={[0, 0.7, -1]} castShadow>
              <boxGeometry args={[1.8, 0.6, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case "sofa":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[2.0, 0.4, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.55, -0.35]} castShadow>
              <boxGeometry args={[2.0, 0.5, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.95, 0.45, 0]} castShadow>
              <boxGeometry args={[0.1, 0.5, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.95, 0.45, 0]} castShadow>
              <boxGeometry args={[0.1, 0.5, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case "table":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[1.4, 0.06, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.6, 0, -0.3]} castShadow>
              <boxGeometry args={[0.06, 0.7, 0.06]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.6, 0, -0.3]} castShadow>
              <boxGeometry args={[0.06, 0.7, 0.06]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.6, 0, 0.3]} castShadow>
              <boxGeometry args={[0.06, 0.7, 0.06]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.6, 0, 0.3]} castShadow>
              <boxGeometry args={[0.06, 0.7, 0.06]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case "counter":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[2.5, 0.9, 0.7]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.92, 0]} castShadow>
              <boxGeometry args={[2.6, 0.06, 0.8]} />
              <meshStandardMaterial color="#d0c8b0" />
            </mesh>
          </group>
        );
      case "shelf":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1.2, 2.0, 0.35]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.5, 0.1]} castShadow>
              <boxGeometry args={[1.1, 0.04, 0.3]} />
              <meshStandardMaterial color="#c0a870" />
            </mesh>
            <mesh position={[0, 0, 0.1]} castShadow>
              <boxGeometry args={[1.1, 0.04, 0.3]} />
              <meshStandardMaterial color="#c0a870" />
            </mesh>
            <mesh position={[0, -0.5, 0.1]} castShadow>
              <boxGeometry args={[1.1, 0.04, 0.3]} />
              <meshStandardMaterial color="#c0a870" />
            </mesh>
          </group>
        );
      case "locker":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.6, 2.0, 0.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.28, 0, 0.22]} castShadow>
              <boxGeometry args={[0.04, 0.15, 0.04]} />
              <meshStandardMaterial color="#c0c0c0" />
            </mesh>
          </group>
        );
      case "cell":
        return (
          <group position={pos} rotation={rot}>
            {[-1, -0.5, 0, 0.5, 1].map((x, i) => (
              <mesh
                // biome-ignore lint/suspicious/noArrayIndexKey: static fixed-length array
                key={i}
                position={[x, 0.5, 0]}
                castShadow
              >
                <boxGeometry args={[0.05, 2.0, 0.05]} />
                <meshStandardMaterial color="#808080" />
              </mesh>
            ))}
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[2.1, 0.05, 0.05]} />
              <meshStandardMaterial color="#808080" />
            </mesh>
            <mesh position={[0, -0.5, 0]} castShadow>
              <boxGeometry args={[2.1, 0.05, 0.05]} />
              <meshStandardMaterial color="#808080" />
            </mesh>
          </group>
        );
      case "tv":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1.2, 0.7, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[1.1, 0.6, 0.01]} />
              <meshStandardMaterial
                color="#1a3a5a"
                emissive="#0a1a2a"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        );
      case "plant":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
              <meshStandardMaterial color="#8b6914" />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case "lamp":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, -0.5, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 1.0, 8]} />
              <meshStandardMaterial color="#c0a870" />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <coneGeometry args={[0.3, 0.4, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      case "car_display":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.15, 0]} castShadow>
              <boxGeometry args={[2.2, 0.3, 1.0]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.55, 0.1]} castShadow>
              <boxGeometry args={[1.8, 0.5, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.55, 0.1]}>
              <boxGeometry args={[1.6, 0.4, 0.7]} />
              <meshStandardMaterial color="#88aacc" transparent opacity={0.5} />
            </mesh>
            <mesh position={[-0.9, 0.05, 0.35]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.1, 12]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            <mesh position={[0.9, 0.05, 0.35]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.1, 12]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            <mesh position={[-0.9, 0.05, -0.35]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.1, 12]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            <mesh position={[0.9, 0.05, -0.35]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.1, 12]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
          </group>
        );
      case "reception":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[3.0, 1.0, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.02, 0]} castShadow>
              <boxGeometry args={[3.1, 0.06, 0.9]} />
              <meshStandardMaterial color="#d0c8b0" />
            </mesh>
          </group>
        );
      case "gate":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[1.5, 1.0, 0.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[1.4, 0.2, 0.4]} />
              <meshStandardMaterial
                color="#4060a0"
                emissive="#2040a0"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        );
      case "pool_water":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, -0.05, 0]} receiveShadow>
              <boxGeometry args={[12, 0.1, 5]} />
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, -0.3, 0]} receiveShadow>
              <boxGeometry args={[12.4, 0.5, 5.4]} />
              <meshStandardMaterial color="#6090a0" />
            </mesh>
          </group>
        );
      case "toilet":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.4, 0.4, 0.6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.45, -0.2]} castShadow>
              <boxGeometry args={[0.4, 0.1, 0.2]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case "sink":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.5, 0.1, 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.08, 0.4, 0.08]} />
              <meshStandardMaterial color="#c0c0c0" />
            </mesh>
          </group>
        );
      case "fridge":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.7, 1.8, 0.7]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.32, 0.3, 0]}>
              <boxGeometry args={[0.04, 0.15, 0.04]} />
              <meshStandardMaterial color="#c0c0c0" />
            </mesh>
          </group>
        );
      case "stove":
        return (
          <group position={pos} rotation={rot}>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.7, 0.8, 0.6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.82, 0]}>
              <boxGeometry args={[0.65, 0.04, 0.55]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {[
              [-0.15, 0, -0.1],
              [0.15, 0, -0.1],
              [-0.15, 0, 0.1],
              [0.15, 0, 0.1],
            ].map(([x, _y, z], i) => (
              <mesh
                // biome-ignore lint/suspicious/noArrayIndexKey: static fixed-length array
                key={i}
                position={[x, 0.86, z]}
              >
                <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
                <meshStandardMaterial color="#555555" />
              </mesh>
            ))}
          </group>
        );
      default:
        return (
          <mesh position={pos} castShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
    }
  };

  return (
    <group>
      {renderFurniture()}
      {item.label && (
        <Billboard position={[pos[0], pos[1] + 1.2, pos[2]]}>
          <Text
            fontSize={0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {item.label}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function InteractiveObjectMesh({
  obj,
  onPickup,
  playerPosition,
}: {
  obj: InteractiveObject;
  onPickup: (id: string, type: string, label: string) => void;
  playerPosition: React.MutableRefObject<THREE.Vector3>;
}) {
  const [hovered, setHovered] = useState(false);
  const [collected, setCollected] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += delta * 1.5;
    }
  });

  const getColor = () => {
    switch (obj.type) {
      case "food":
        return "#ff8844";
      case "drink":
        return "#44aaff";
      case "weapon":
        return "#888888";
      case "medkit":
        return "#ff4444";
      case "handcuffs":
        return "#c0c0c0";
      case "baton":
        return "#8b6914";
      case "taser":
        return "#ffff00";
      case "extinguisher":
        return "#ff4400";
      case "flashbang":
        return "#ffff88";
      case "armor":
        return "#4060a0";
      case "rifle":
        return "#404040";
      default:
        return "#ffffff";
    }
  };

  if (collected) return null;

  return (
    <group position={obj.position}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: R3F 3D mesh does not support keyboard events */}
      <mesh
        ref={meshRef}
        position={[0, 0.3, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          const dist = playerPosition.current.distanceTo(
            new THREE.Vector3(...obj.position),
          );
          if (dist < 3) {
            setCollected(true);
            onPickup(obj.id, obj.type, obj.label);
          }
        }}
      >
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={hovered ? getColor() : "#000000"}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>
      <Billboard position={[0, 0.8, 0]}>
        <Text
          fontSize={0.2}
          color={hovered ? "#ffff00" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {hovered ? `[E] Pick up ${obj.label}` : obj.label}
        </Text>
      </Billboard>
    </group>
  );
}

function InteriorNPC({ npc }: { npc: NPCSpawn }) {
  const getColor = () => {
    switch (npc.role) {
      case "officer":
        return "#1a3a6a";
      case "swat":
        return "#1a1a1a";
      case "doctor":
        return "#ffffff";
      case "nurse":
        return "#f0f0ff";
      case "firefighter":
        return "#cc4400";
      case "paramedic":
        return "#ffffff";
      case "dealer":
        return "#4a3a2a";
      case "customer":
        return "#6a5a4a";
      case "receptionist":
        return "#3a4a6a";
      default:
        return "#5a4a3a";
    }
  };

  return (
    <group position={npc.position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.25, 1.0, 4, 8]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      <Billboard position={[0, 2.2, 0]}>
        <Text
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {npc.name}
        </Text>
      </Billboard>
    </group>
  );
}

function ExitDoor({
  position,
  onExit,
}: { position: [number, number, number]; onExit: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: R3F 3D mesh does not support keyboard events */}
      <mesh
        position={[0, 1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onExit}
      >
        <boxGeometry args={[1.2, 2.2, 0.15]} />
        <meshStandardMaterial
          color={hovered ? "#44ff44" : "#228822"}
          emissive={hovered ? "#22aa22" : "#114411"}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Billboard position={[0, 2.5, 0]}>
        <Text
          fontSize={0.25}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {hovered ? "[E] Exit Building" : "🚪 EXIT"}
        </Text>
      </Billboard>
    </group>
  );
}

export default function BuildingInteriorManager({
  layout,
  onExit,
  playerPosition,
  onPickupItem,
  onInteractNPC: _onInteractNPC,
}: BuildingInteriorManagerProps) {
  const handlePickup = useCallback(
    (id: string, type: string, label: string) => {
      onPickupItem?.(id, type, label);
    },
    [onPickupItem],
  );

  const halfW = layout.size[0] / 2;
  const halfD = layout.size[1] / 2;

  return (
    <group>
      {/* Ambient lighting for interior */}
      <ambientLight intensity={0.8} color="#fff8f0" />
      <pointLight
        position={[0, 4, 0]}
        intensity={1.2}
        color="#fff8e8"
        castShadow
      />
      <pointLight
        position={[-halfW / 2, 4, 0]}
        intensity={0.6}
        color="#fff8e8"
      />
      <pointLight
        position={[halfW / 2, 4, 0]}
        intensity={0.6}
        color="#fff8e8"
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[layout.size[0], layout.size[1]]} />
        <meshStandardMaterial color={layout.floorColor} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[layout.size[0], layout.size[1]]} />
        <meshStandardMaterial color={layout.ceilingColor} />
      </mesh>

      {/* Walls */}
      {/* North wall */}
      <mesh position={[0, 1.5, -halfD]} castShadow receiveShadow>
        <boxGeometry args={[layout.size[0], 3, 0.2]} />
        <meshStandardMaterial color={layout.wallColor} />
      </mesh>
      {/* South wall (with door gap) */}
      <mesh position={[-halfW / 2 - 0.5, 1.5, halfD]} castShadow receiveShadow>
        <boxGeometry args={[halfW - 1, 3, 0.2]} />
        <meshStandardMaterial color={layout.wallColor} />
      </mesh>
      <mesh position={[halfW / 2 + 0.5, 1.5, halfD]} castShadow receiveShadow>
        <boxGeometry args={[halfW - 1, 3, 0.2]} />
        <meshStandardMaterial color={layout.wallColor} />
      </mesh>
      {/* Door frame top */}
      <mesh position={[0, 2.6, halfD]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.4, 0.2]} />
        <meshStandardMaterial color={layout.wallColor} />
      </mesh>
      {/* East wall */}
      <mesh position={[halfW, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3, layout.size[1]]} />
        <meshStandardMaterial color={layout.wallColor} />
      </mesh>
      {/* West wall */}
      <mesh position={[-halfW, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3, layout.size[1]]} />
        <meshStandardMaterial color={layout.wallColor} />
      </mesh>

      {/* Room dividers */}
      {layout.rooms.map((room) => (
        <group key={room.id}>
          {/* Room floor overlay */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
              (room.bounds.minX + room.bounds.maxX) / 2,
              0.01,
              (room.bounds.minZ + room.bounds.maxZ) / 2,
            ]}
            receiveShadow
          >
            <planeGeometry
              args={[
                room.bounds.maxX - room.bounds.minX,
                room.bounds.maxZ - room.bounds.minZ,
              ]}
            />
            <meshStandardMaterial color={room.floorColor} />
          </mesh>
          {/* Furniture */}
          {room.furniture.map((item, idx) => (
            <FurnitureMesh key={`${room.id}-${idx}`} item={item} />
          ))}
        </group>
      ))}

      {/* Interactive objects */}
      {layout.interactiveObjects.map((obj) => (
        <InteractiveObjectMesh
          key={obj.id}
          obj={obj}
          onPickup={handlePickup}
          playerPosition={playerPosition}
        />
      ))}

      {/* Interior NPCs */}
      {layout.npcSpawns.map((npc) => (
        <InteriorNPC key={npc.id} npc={npc} />
      ))}

      {/* Exit door */}
      <ExitDoor position={layout.exitPosition} onExit={onExit} />

      {/* Building name sign */}
      <Billboard position={[0, 2.8, halfD - 0.3]}>
        <Text
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          {layout.displayName}
        </Text>
      </Billboard>
    </group>
  );
}
